import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { UserPermissions } from "$lib/enums/permission";
import { getProject, updateProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { credentialsFormSchema } from "./schema";

let projectId: string;

export const load: PageServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const permissions: UserPermissions[] = [];
  if (isAdmin) {
    permissions.push(UserPermissions.ViewDBCredentials);
  }
  const user = await getUser(autheticatedUser.email!);
  const project = await getProject(event.params.slug);
  if (!project) {
    error(404, 'Unknown project');
  }
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(403, 'Access denied, you are not assigned to this project');
  }
  projectId = project.id;
  return {
    project,
    permissions,
    credentialsForm: await superValidate(project.credentails, zod(credentialsFormSchema)),
    seo: {
      title: project?.name || 'Unknown project',
    }
  }
}

export const actions: Actions = {
  fb_credentials: async (event) => {
    const form = await superValidate(event, zod(credentialsFormSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const autheticatedUser = await getAuthenticatedUser(event);
    if (!autheticatedUser) {
      error(401, 'Unauthorized');
    }
    const isAdmin = await isAdminUser(autheticatedUser.uid);
    if (!isAdmin) {
      error(403, 'Forbidden');
    }
    const updateProjectCredentials = await updateProject(projectId, { credentails: form.data });
    if (!updateProjectCredentials) {
      return fail(400, {form});
    }
    return {
      form,
    };
  },
};