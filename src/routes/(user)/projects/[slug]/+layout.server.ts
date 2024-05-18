import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";

export const load: LayoutServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  const project = await getProject(event.params.slug);
  if (!project) {
    error(404, 'Unknown project');
  }
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(403, 'Access denied, you are not assigned to this project');
  }
  return {
    project,
    seo: {
      title: project?.name || 'Unknown project',
    }
  }
}
