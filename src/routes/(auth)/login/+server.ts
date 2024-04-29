import { Cookies } from "$lib/enums/cookies";
import { json, type RequestEvent } from "@sveltejs/kit"

export async function POST(event: RequestEvent) {
  const body = await event.request.formData();
  const authToken = body.get(Cookies.Session)?.toString();
  if (authToken) {
    event.cookies.set(Cookies.Session, authToken, { path: '/' });
  } else {
    event.cookies.delete(Cookies.Session, {path: '/'});
  }
  return json({ success: true });
}