FROM gcr.io/distroless/nodejs20-debian12@sha256:3db2ff68a5e0a09955ee9199d6de23a11e65e7a032d75a2f29ca44b36cb46ea8


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
