import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function serviceDB() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    throw new HttpError(
      503,
      "This service is not configured yet. Please try again after launch.",
    );
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function authenticated(request: Request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    throw new HttpError(503, "Account services are not configured.");
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) throw new HttpError(401, "Please sign in to continue.");
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);
  if (error || !user)
    throw new HttpError(401, "Your session has expired. Please sign in again.");
  return { db, user };
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  let submitted: URL;
  try {
    submitted = new URL(origin);
  } catch {
    throw new HttpError(403, "Request origin is not allowed.");
  }
  const destination = new URL(request.url);
  const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url)
    .origin;
  // Next can normalize the localhost URL; Host retains the browser destination.
  // Do not use untrusted forwarded-host headers for this comparison.
  const matchesHost =
    submitted.host === request.headers.get("host") &&
    submitted.protocol === destination.protocol;
  if (origin !== allowed && origin !== destination.origin && !matchesHost)
    throw new HttpError(403, "Request origin is not allowed.");
}
export async function body(request: Request) {
  const raw = await request.text();
  if (raw.length > 12000)
    throw new HttpError(413, "Please shorten your input.");
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, "Invalid JSON request.");
  }
}
export async function limit(key: string, max: number, seconds = 3600) {
  const hash = createHash("sha256").update(key).digest("hex");
  const { data, error } = await serviceDB().rpc("consume_rate_limit", {
    bucket_key: hash,
    max_requests: max,
    window_seconds: seconds,
  });
  if (error)
    throw new HttpError(
      503,
      "Rate limiting is unavailable. Please try again shortly.",
    );
  if (!data)
    throw new HttpError(
      429,
      "You’ve reached the request limit. Please try again later.",
    );
}
export function failure(error: unknown) {
  if (error instanceof HttpError)
    return Response.json({ error: error.message }, { status: error.status });
  if (error && typeof error === "object" && "issues" in error)
    return Response.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  return Response.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
