import {
  body,
  failure,
  limit,
  sameOrigin,
  serviceDB,
  HttpError,
} from "@/lib/server";
import { waitlistInput } from "@/lib/validation";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const input = waitlistInput.parse(await body(request));
    // Vercel overwrites this header; global bucket also caps other deployments.
    await limit(
      `waitlist:${request.headers.get("x-vercel-forwarded-for") || "public"}`,
      5,
      3600,
    );
    await limit("waitlist:global", 100, 3600);
    const { error } = await serviceDB()
      .from("waitlist_subscribers")
      .upsert(
        { name: input.name, email: input.email },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (error)
      throw new HttpError(
        503,
        "We could not save your request. Please try again later.",
      );
    return Response.json({
      message: "You’re on the list. We’ll be in touch when early access opens.",
    });
  } catch (error) {
    return failure(error);
  }
}
