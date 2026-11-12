import {
  authenticated,
  body,
  failure,
  limit,
  sameOrigin,
  HttpError,
} from "@/lib/server";
import { aiInput } from "@/lib/validation";
import { generate } from "@/lib/ai";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { db, user } = await authenticated(request);
    const input = aiInput.parse(await body(request));
    await limit(`ai:${user.id}`, 20);
    const result = await generate(input);
    const { data: preferences, error: preferencesError } = await db
      .from("user_preferences")
      .select("save_generations")
      .eq("user_id", user.id)
      .maybeSingle();
    if (preferencesError)
      throw new HttpError(
        503,
        "Your privacy preferences could not be loaded. No suggestion has been stored. Please try again.",
      );
    if (preferences?.save_generations !== false) {
      const { error } = await db.from("ai_generations").insert({
        user_id: user.id,
        occasion: input.occasion,
        category: input.category,
        result,
      });
      if (error)
        throw new HttpError(
          503,
          "Your suggestion was generated but could not be saved. Turn off suggestion history in Settings or try again.",
        );
    }
    return Response.json(
      { result, mode: "live" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
