import { getAuthenticatedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const body = await event.request.formData();
  let success = false;
  return json({success});
}
export async function PUT(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const body = await event.request.formData();
  let success = false;
  return json({success});
}
export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const body = await event.request.formData();
  let success = false;
  return json({success});
}