import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { t } from "$lib/i18n/translations";

export const load: LayoutServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  const project = await getProject(event.params.slug);
  if (!project) {
    error(404, t.get('common.unknown_project'));
  }
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(403, t.get('common.not_assigned_to_project_error'));
  }
  return {
    project,
    seo: {
      title: project?.name || t.get('common.unknown_project'),
    }
  }
}
