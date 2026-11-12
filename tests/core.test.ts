import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aiInput,
  aiOutput,
  personInput,
  reminderInput,
  waitlistInput,
} from "../lib/validation";
import { defaultInput, sampleSuggestion } from "../lib/sample";
import { sampleWorkspace } from "../lib/workspace-types";
import { generate } from "../lib/ai";
import { authenticated, sameOrigin, HttpError } from "../lib/server";
test("sample suggestions respond to inputs and match live response contract", () => {
  const a = sampleSuggestion(defaultInput);
  const b = sampleSuggestion({
    ...defaultInput,
    occasion: "Graduation",
    interests: "Gardening, painting",
    tone: "Playful",
  });
  assert.ok(aiOutput.safeParse(a).success);
  assert.ok(aiOutput.safeParse(b).success);
  assert.notEqual(a.message, b.message);
  assert.match(b.message, /graduation/);
  assert.match(b.gifts[0].title, /gardening/);
});
test("validation rejects oversized, invalid, and unsupported AI fields", () => {
  assert.equal(
    aiInput.safeParse({ ...defaultInput, interests: "a".repeat(501) }).success,
    false,
  );
  assert.equal(
    aiInput.safeParse({ ...defaultInput, tone: "hostile" }).success,
    false,
  );
  assert.equal(
    aiInput.safeParse({ ...defaultInput, occasion: "   " }).success,
    false,
  );
  assert.equal(aiOutput.safeParse({ message: "Hi", gifts: [] }).success, false);
});
test("waitlist validates email, normalizes casing, and rejects honeypot", () => {
  assert.equal(
    waitlistInput.parse({ name: " Alex ", email: "Alex@Example.com" }).email,
    "alex@example.com",
  );
  assert.equal(
    waitlistInput.safeParse({ name: "Alex", email: "bad" }).success,
    false,
  );
  assert.equal(
    waitlistInput.safeParse({
      name: "Alex",
      email: "a@example.com",
      website: "spam",
    }).success,
    false,
  );
});
test("workspace validation prevents invalid dates and times", () => {
  const valid = {
    title: "Call",
    date: "2026-11-18",
    time: "09:30",
    description: "",
    completed: false,
  };
  assert.ok(reminderInput.safeParse(valid).success);
  assert.equal(
    reminderInput.safeParse({ ...valid, time: "25:90" }).success,
    false,
  );
  assert.equal(
    reminderInput.safeParse({ ...valid, date: "2026-02-30" }).success,
    false,
  );
  assert.ok(
    personInput.safeParse({
      name: "Jamie",
      category: "Partner",
      interests: "",
      notes: "",
      important_date: null,
      occasion: "",
    }).success,
  );
});
test("sample records are identifiable and start without fake AI history", () => {
  const data = sampleWorkspace();
  assert.ok(data.relationships.every((p) => p.id.startsWith("demo-")));
  assert.equal(data.ai_generations.length, 0);
  assert.ok(data.reminders.every((r) => reminderInput.safeParse(r).success));
});
test("missing model credentials fail explicitly rather than returning sample data", async () => {
  const old = process.env.AI_API_KEY;
  delete process.env.AI_API_KEY;
  await assert.rejects(
    generate(defaultInput),
    (e: unknown) => e instanceof HttpError && e.status === 503,
  );
  if (old) process.env.AI_API_KEY = old;
});
test("cross-origin mutations are rejected", () => {
  assert.throws(
    () =>
      sameOrigin(
        new Request("https://emakings.site/api/ai", {
          headers: { origin: "https://attacker.example" },
        }),
      ),
    HttpError,
  );
  assert.doesNotThrow(() =>
    sameOrigin(
      new Request("https://emakings.site/api/ai", {
        headers: { origin: "https://emakings.site" },
      }),
    ),
  );
});
test("same-origin check accepts the browser destination when Next normalizes localhost", () => {
  assert.doesNotThrow(() =>
    sameOrigin(
      new Request("http://localhost:3000/api/waitlist", {
        headers: { origin: "http://127.0.0.1:3000", host: "127.0.0.1:3000" },
      }),
    ),
  );
  assert.throws(
    () =>
      sameOrigin(
        new Request("http://localhost:3000/api/waitlist", {
          headers: {
            origin: "https://attacker.example",
            host: "127.0.0.1:3000",
          },
        }),
      ),
    HttpError,
  );
  assert.throws(
    () =>
      sameOrigin(
        new Request("http://localhost:3000/api/waitlist", {
          headers: { origin: "null", host: "localhost:3000" },
        }),
      ),
    HttpError,
  );
});
test("private APIs reject absent authorization", async () => {
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
    oldKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test";
  await assert.rejects(
    authenticated(new Request("https://emakings.site/api/workspace")),
    (e: unknown) => e instanceof HttpError && e.status === 401,
  );
  if (oldUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
  else delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (oldKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = oldKey;
  else delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});
