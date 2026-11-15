# Upwork Assistant — ingestion server

The server half of [Upwork Assistant](https://github.com/codestrongio/upwork-assistant-home). It
receives one authenticated request per deliberate capture, writes the page HTML to private MinIO
object storage and one metadata record to MongoDB. It never fetches Upwork content itself.

Specification: [`docs/prd.md`](https://github.com/codestrongio/upwork-assistant-home/blob/main/docs/prd.md)
and [`docs/technical-design.md`](https://github.com/codestrongio/upwork-assistant-home/blob/main/docs/technical-design.md)
§1, §4–§9.

## What is here

| Path | Contents |
|---|---|
| `src/app.ts` | The Fastify application: request size cap, internal liveness route |
| `src/index.ts` | The process: listen address from the environment, graceful shutdown |
| `tests/` | Vitest, driving the app through `inject` — no port, no network |
| `Dockerfile` | Multi-stage, non-root runtime image with a health check |
| `.github/workflows/ci.yml` | Lint, type-check, test, compile, then build the image and hit its health route |

`POST /v1/pages`, key authentication (`TD §5.1`), the MinIO write and the MongoDB insert are the
Milestone 1 issues; the process boundary they need is what exists today.

## Develop

```
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm start          # listens on 0.0.0.0:8080 by default; HOST and PORT override it
```

There is no `.env` and no local MongoDB or MinIO requirement yet: the tests need neither. When the
storage routes land, the deployment variables are the ones in `TD §8` — `MONGODB_URI`,
`MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` — supplied as deployment
secrets, never committed.

## Container

```
docker build -t upwork-assistant-server .
docker run --rm -p 8080:8080 upwork-assistant-server
curl -fsS http://127.0.0.1:8080/healthz
```

## Working on it

Read [`AGENTS.md`](AGENTS.md) first. Keys follow the Feedback Server's convention, documented in
`TD §5.1` and `ADR-0003`: a `uak_` key is created in the trusted environment, stored as issued in
the `keys` collection, and revoked by deleting its document. There is no key endpoint.
