import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { deleteUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  if (!isAdmin) {
    error(403, 'Forbidden');
  }
  const userDeleted = await deleteUser(event.params.slug);
  return json({
    success: !!userDeleted
  })
}
