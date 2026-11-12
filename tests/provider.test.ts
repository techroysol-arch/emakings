import { test } from "node:test";
import assert from "node:assert/strict";
import { generate } from "../lib/ai";
import { defaultInput, sampleSuggestion } from "../lib/sample";
import { HttpError } from "../lib/server";

test("provider sends an authenticated structured prompt and validates the response", async () => {
  const previous = {
    base: process.env.AI_BASE_URL,
    key: process.env.AI_API_KEY,
    model: process.env.AI_MODEL,
    fetch: globalThis.fetch,
  };
  process.env.AI_BASE_URL = "https://provider.example/v1";
  process.env.AI_API_KEY = "test-server-key";
  process.env.AI_MODEL = "test-model";
  const expected = sampleSuggestion(defaultInput);
  let sent = false;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://provider.example/v1/chat/completions");
    const headers = init?.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer test-server-key");
    const payload = JSON.parse(init?.body as string);
    assert.equal(payload.model, "test-model");
    assert.deepEqual(JSON.parse(payload.messages[1].content), defaultInput);
    assert.ok(init?.signal);
    sent = true;
    return Response.json({
      choices: [{ message: { content: JSON.stringify(expected) } }],
    });
  };
  try {
    assert.deepEqual(await generate(defaultInput), expected);
    assert.ok(sent);
    globalThis.fetch = async () =>
      new Response("provider failed", { status: 500 });
    await assert.rejects(
      generate(defaultInput),
      (e: unknown) => e instanceof HttpError && e.status === 502,
    );
    globalThis.fetch = async () =>
      Response.json({ choices: [{ message: { content: '{"gifts":[]}' } }] });
    await assert.rejects(
      generate(defaultInput),
      (e: unknown) => e instanceof HttpError && e.status === 502,
    );
    globalThis.fetch = async () => {
      throw new Error("connection refused");
    };
    await assert.rejects(
      generate(defaultInput),
      (e: unknown) => e instanceof HttpError && e.status === 502,
    );
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [name, value] of [
      ["AI_BASE_URL", previous.base],
      ["AI_API_KEY", previous.key],
      ["AI_MODEL", previous.model],
    ]) {
      if (value) process.env[name!] = value;
      else delete process.env[name!];
    }
  }
});
