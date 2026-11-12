import { createClient, type SupabaseClient } from "@supabase/supabase-js";
let browser: SupabaseClient | undefined;
export const authConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
export function browserDB() {
  if (!authConfigured())
    throw new Error(
      "Account services are not configured yet. Please explore the demo workspace.",
    );
  return (browser ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "pkce" } },
  ));
}
