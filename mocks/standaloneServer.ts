/**
 * A minimal real HTTP server that answers requests using MSW request handlers
 * (as produced by msw-auto-mock, see mocks/generated/*).
 *
 * We deliberately do NOT use MSW's `setupServer(...).listen()` in-process interception
 * here: Next.js's dev server (both Turbopack and webpack) periodically resets
 * `globalThis.fetch` back to the native implementation on every module recompile
 * (see `resetFetch` in next/dist/server/lib/router-server.js), which silently discards
 * any in-process fetch patch installed via instrumentation.ts. Running a real server on
 * the actual mocked backend's port sidesteps that problem entirely: from Next.js's
 * point of view this is just a normal backend responding on http://localhost:<port>,
 * exactly like the real service would.
 */
import http from 'node:http';
import { Readable } from 'node:stream';
import type { RequestHandler } from 'msw';

export function startMockHttpServer(port: number, handlers: RequestHandler[], label: string): http.Server {
  const server = http.createServer(async (req, res) => {
    try {
      // Build the absolute URL via string concatenation rather than `new URL(req.url, base)`:
      // when req.url itself starts with "//" (e.g. a client base URL with a trailing slash
      // combined with a path starting with "/", producing "//drift/..."), the WHATWG URL
      // resolution algorithm treats a leading "//" as *protocol-relative* and replaces the
      // base's host entirely, silently dropping "localhost:<port>" and the "/drift" segment.
      // Also defensively collapse any repeated slashes in the path itself (e.g. a
      // misconfigured *_API_BASE_URL with a trailing slash) so mock handlers still match.
      const rawUrl = (req.url ?? '/').replace(/([^:])\/{2,}/g, '$1/');
      const url = new URL(`http://localhost:${port}${rawUrl}`);
      const method = (req.method ?? 'GET').toUpperCase();
      const hasBody = method !== 'GET' && method !== 'HEAD';

      let body: Buffer | undefined;
      if (hasBody) {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
      }

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else if (value != null) {
          headers.set(key, value);
        }
      }

      const request = new Request(url, { method, headers, body: body as BodyInit | undefined });

      for (const handler of handlers) {
        const isMatch = await handler.test({ request: request.clone() });
        if (!isMatch) continue;

        const result = await handler.run({ request, requestId: crypto.randomUUID() });
        if (!result?.response) continue;

        res.statusCode = result.response.status;
        result.response.headers.forEach((value, key) => res.setHeader(key, value));
        if (result.response.body) {
          Readable.fromWeb(result.response.body as never).pipe(res);
        } else {
          res.end();
        }
        return;
      }

      console.warn(`[mock:${label}] No mock handler matched ${method} ${url.pathname}`);
      res.statusCode = 501;
      res.setHeader('content-type', 'text/plain');
      res.end(`[mock:${label}] No mock handler matched ${method} ${url.pathname}`);
    } catch (err) {
      console.error(`[mock:${label}] Error handling request`, err);
      if (!res.headersSent) {
        res.statusCode = 500;
      }
      res.end('Mock server error');
    }
  });

  server.listen(port, () => {
    console.log(`[mock:${label}] Fake ${label} backend listening on http://localhost:${port}`);
  });

  return server;
}
