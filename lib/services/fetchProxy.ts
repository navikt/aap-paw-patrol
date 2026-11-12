import 'server-only';

import { getToken, requestAzureOboToken, validateToken } from '@navikt/oasis';
import { getAccessTokenOrRedirectToLogin, logWarning } from '@navikt/aap-felles-utils';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { hentLocalToken } from 'lib/services/localTokenService';

export class ProxyError extends Error {
  constructor(public readonly status: number) {
    super('Kall til tjenesten feilet');
    this.name = 'ProxyError';
  }
}

export const isLocal = async () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
};

const NUMBER_OF_RETRIES = 3;

const getOnBefalfOfToken = async (audience: string, url: string, errorContext?: string): Promise<string> => {
  const requestHeaders = await headers();
  const token = errorContext ? getToken(requestHeaders) : getAccessTokenOrRedirectToLogin(requestHeaders);
  if (!token) {
    if (errorContext) throw new ProxyError(401);
    logWarning(`Token for ${url} er undefined`);
    throw new Error('Token for simpleTokenXProxy is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    if (errorContext) throw new ProxyError(401);
    logWarning(`Token for ${url} validerte ikke (errortype=${validation.errorType})`, validation.error);
    throw new Error('Token for simpleTokenXProxy didnt validate');
  }

  const onBehalfOf = await requestAzureOboToken(token, audience);
  if (!onBehalfOf.ok) {
    if (errorContext) throw new ProxyError(502);
    logWarning(`Henting av oboToken for ${url} feilet`, onBehalfOf.error);
    throw new Error('Request oboToken for simpleTokenXProxy failed');
  }

  return onBehalfOf.token;
};

export const fetchProxy = async <ResponseBody>(
  url: string,
  scope: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  requestBody?: object,
  tags?: string[],
  errorContext?: string
): Promise<ResponseBody> => {
  try {
    const oboToken = (await isLocal())
      ? await hentLocalToken(scope)
      : await getOnBefalfOfToken(scope, url, errorContext);
    return await fetchWithRetry<ResponseBody>(
      url,
      method,
      oboToken,
      NUMBER_OF_RETRIES,
      requestBody,
      tags,
      errorContext
    );
  } catch (error) {
    if (!errorContext) throw error;
    unstable_rethrow(error);
    const safeError = error instanceof ProxyError ? error : new ProxyError(502);
    logWarning(`${errorContext} feilet (HTTP ${safeError.status})`);
    throw safeError;
  }
};

export const fetchWithRetry = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  errorContext?: string
): Promise<ResponseBody> => {
  if (errorContext) {
    try {
      return await fetchResponse<ResponseBody>(url, method, oboToken, retries, requestBody, tags, errorContext);
    } catch (error) {
      unstable_rethrow(error);
      throw error instanceof ProxyError ? error : new ProxyError(502);
    }
  }
  return await fetchResponse<ResponseBody>(url, method, oboToken, retries, requestBody, tags);
};

const fetchResponse = async <ResponseBody>(
  url: string,
  method: string,
  oboToken: string,
  retries: number,
  requestBody?: object,
  tags?: string[],
  errorContext?: string
): Promise<ResponseBody> => {
  if (retries === 0) {
    if (errorContext) throw new ProxyError(502);
    throw new Error(`Unable to fetch ${url}: ${retries} retries left`);
  }

  const response = await fetch(url, {
    method,
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${oboToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0, tags },
  });

  // Mulige statuskoder:
  // 200
  // 204
  // 404
  // 500 og 400 (med feilmelding i body)

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  if (!response.ok) {
    if (errorContext) {
      if ([400, 401, 403, 404, 500].includes(response.status) || retries <= 1) {
        throw new ProxyError(response.status);
      }
      return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags, errorContext);
    }
    if (response.status === 500 || response.status === 400) {
      let responseJson;
      try {
        responseJson = await response.json();
      } catch (error) {
        logWarning('Klarte ikke parse JSON fra response', error);
        throw new Error('Klarte ikke parse JSON fra response', { cause: error });
      }
      logWarning(`klarte ikke å hente ${url}: ${responseJson.message}`);
      throw new Error(`Unable to fetch ${url}: ${responseJson.message}`);
    }
    if (response.status === 404) {
      throw new Error(`Ikke funnet: ${url}`);
    }
    if (response.status === 401 || response.status === 403) {
      logWarning(`Ingen tilgang til ${url} (HTTP ${response.status})`);
      throw new Error(`Ingen tilgang`);
    }

    logWarning(
      `Kall mot ${url} feilet med statuskode ${response.status}, prøver på nytt. Antall forsøk igjen: ${retries}`
    );
    return await fetchWithRetry(url, method, oboToken, retries - 1, requestBody, tags);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text')) {
    return (await response.text()) as ResponseBody;
  }

  return await response.json();
};
