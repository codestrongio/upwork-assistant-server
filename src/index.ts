/** The process: read the listen address from the environment and shut down on a signal. */
import { buildApp } from "./app.js";

const host = process.env["HOST"] ?? "0.0.0.0";
const port = Number(process.env["PORT"] ?? "8080");

const app = buildApp();

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void app.close().then(() => process.exit(0));
  });
}

try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
