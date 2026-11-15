/**
 * The HTTP application, built apart from the process that listens (`index.ts`) so a test drives it
 * through `inject` with no port and no network.
 *
 * Milestone 1 routes land with their issues: `POST /v1/pages` (TD §4), its key authentication
 * (TD §5.1), the MinIO write and the MongoDB insert (TD §6, §7). What exists now is the process
 * boundary every one of those needs — one Fastify instance, the request size cap the design
 * proposes, and an internal liveness route.
 */
import Fastify, { type FastifyInstance } from "fastify";

/** TD §4's proposed maximum request body: 10 MiB of UTF-8 HTML plus the metadata around it. */
export const BODY_LIMIT_BYTES = 10 * 1024 * 1024;

export function buildApp(): FastifyInstance {
  const app = Fastify({
    // Logging is configured by the entry point, so a test's output stays its own.
    logger: false,
    bodyLimit: BODY_LIMIT_BYTES,
    // The proxy terminates TLS and sets the client address; a request's own claim is never trusted.
    trustProxy: true,
  });

  // Liveness only. TD §8 keeps every operational route off the public ingress, so this is not
  // exposed by the reverse proxy and carries no data beyond the fact that the process answers.
  app.get("/healthz", async () => ({ status: "ok" }));

  return app;
}
