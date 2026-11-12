import {
  authenticated,
  body,
  failure,
  HttpError,
  sameOrigin,
  serviceDB,
} from "@/lib/server";
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    const { user } = await authenticated(request);
    const input = await body(request);
    if (input.confirmation !== "DELETE")
      throw new HttpError(400, "Type DELETE to confirm account deletion.");
    const { error } = await serviceDB().auth.admin.deleteUser(user.id);
    if (error)
      throw new HttpError(
        503,
        "Account deletion could not be completed. Try again later.",
      );
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
