import { t } from "$lib/i18n/translations";
import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { getTotalPatients } from "$lib/server/dashboard.db";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";

export async function GET(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const project = await getProject(event.params.slug);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(403, t.get('common.not_assigned_to_project_error'));
  }
  const totalPatients = await getTotalPatients(project);
  return json(totalPatients ?? 0);
}
