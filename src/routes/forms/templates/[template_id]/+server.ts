import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { t } from "$lib/i18n/translations";
import { getUser } from "$lib/server/users.db";
import { getProject } from "$lib/server/projects.db";
import { deleteFormTemplate } from "$lib/server/forms.db";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const projectId = event.url.searchParams.get('projectId'); 
  if (projectId === null || projectId === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, t.get('common.unauthorized'));
  }
  const formAdded = await deleteFormTemplate(event.params.template_id);
  return json({
    success: !!formAdded
  })
}