import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { deleteProject } from "$lib/server/projects.db";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  if (!isAdmin) {
    error(403, 'Forbidden');
  }
  const projectDeleted = await deleteProject(event.params.slug);
  return json({
    success: !!projectDeleted
  })
}
