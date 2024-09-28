import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { t } from "$lib/i18n/translations";
import { getUser } from "$lib/server/users.db";
import { getProject } from "$lib/server/projects.db";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const projectId = event.params.slug;
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, t.get('common.unauthorized'));
  }
  const formRemoved = true// await removeForm(projectId);
  return json({
    success: !!formRemoved
  })
}

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const projectId = event.params.slug;
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, t.get('common.unauthorized'));
  }
  const formAdded = true // await addForm(event.params.slug);
  return json({
    success: !!formAdded
  })
}