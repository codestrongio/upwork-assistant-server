import { describe, expect, it } from "vitest";

import { buildApp, BODY_LIMIT_BYTES } from "../src/app.js";

describe("the HTTP application", () => {
  it("answers liveness", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/healthz" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
    await app.close();
  });

  it("has no route that reads a capture yet", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "POST", url: "/v1/pages" });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it("caps a request body at the design's limit", async () => {
    const app = buildApp();
    const oversize = "x".repeat(BODY_LIMIT_BYTES + 1);
    const response = await app.inject({
      method: "POST",
      url: "/v1/pages",
      headers: { "content-type": "application/json" },
      payload: oversize,
    });

    expect(response.statusCode).toBe(413);
    await app.close();
  });
});
