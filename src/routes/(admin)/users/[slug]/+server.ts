import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { deleteUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { t } from "$lib/i18n/translations";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  if (!isAdmin) {
    error(403, t.get('common.forbidden'));
  }
  const userDeleted = await deleteUser(event.params.slug);
  return json({
    success: !!userDeleted
  })
}
