import {
  authenticated,
  body,
  failure,
  HttpError,
  sameOrigin,
} from "@/lib/server";
import { personInput, reminderInput, preferencesInput } from "@/lib/validation";
import { z } from "zod";
const tables = [
  "relationships",
  "reminders",
  "user_preferences",
  "ai_generations",
] as const;
export async function GET(request: Request) {
  try {
    const { db, user } = await authenticated(request);
    const results = await Promise.all(
      tables.map((table) =>
        db
          .from(table)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(500),
      ),
    );
    if (results.some((r) => r.error))
      throw new HttpError(
        503,
        "Your workspace could not be loaded. Please check the database configuration.",
      );
    return Response.json(
      Object.fromEntries(tables.map((t, i) => [t, results[i].data])),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { db, user } = await authenticated(request);
    const input = await body(request);
    const table = z
      .enum(["relationships", "reminders", "user_preferences"])
      .parse(input.table);
    const record =
      table === "relationships"
        ? personInput.parse(input.record)
        : table === "reminders"
          ? reminderInput.parse(input.record)
          : preferencesInput.parse(input.record);
    if (table === "user_preferences") {
      const { data, error } = await db
        .from(table)
        .upsert({ ...record, user_id: user.id }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw new HttpError(400, "Could not save preferences.");
      return Response.json(data);
    }
    const id = input.id ? z.uuid().parse(input.id) : null;
    const query = id
      ? db.from(table).update(record).eq("id", id).eq("user_id", user.id)
      : db.from(table).insert({ ...record, user_id: user.id });
    const { data, error } = await query.select().single();
    if (error)
      throw new HttpError(
        400,
        "Could not save this item. Check your input and try again.",
      );
    return Response.json(data);
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    const { db, user } = await authenticated(request);
    const input = await body(request);
    const table = z
      .enum(["relationships", "reminders", "ai_generations"])
      .parse(input.table);
    const id = z.uuid().parse(input.id);
    const { error } = await db
      .from(table)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new HttpError(400, "Could not delete this item.");
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
