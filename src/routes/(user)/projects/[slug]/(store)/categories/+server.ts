import { getAuthenticatedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { deleteCategory } from "$lib/server/store.db";
import type { Project } from "$lib/models/project";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  let success = false;
  const body = await event.request.formData();
  const id = body.get('id')?.toString();
  const project: Project | undefined = JSON.parse(body.get('project')?.toString() ?? '') as Project | undefined;
  if (!id || !project) { return false;}
  const deleteRes = await deleteCategory(project, id);
  success = !!deleteRes;
  return json({success});
}