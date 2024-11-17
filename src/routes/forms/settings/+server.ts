import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { t } from "$lib/i18n/translations";
import { getUser } from "$lib/server/users.db";
import { getProject, updateProject } from "$lib/server/projects.db";

export async function PUT(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const data = await event.request.formData(); 
  const projectId = data.get('project_id')?.toString();
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
  const footer = data.get('footer')?.toString();
  const formSettingsUpdated = await updateProject(projectId, { settings: {[project.type]: { forms: { footer } } } });
  return json({
    success: !!formSettingsUpdated
  })
}