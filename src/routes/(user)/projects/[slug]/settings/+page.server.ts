import { error, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { credentialsFormSchema } from "./schema";
import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { updateProject } from "$lib/server/projects.db";
import type { PageServerLoad } from "./$types";

let projectId: string;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  projectId = parentData.project.id;
  return {
    credentialsForm: await superValidate(parentData.project.credentails, zod(credentialsFormSchema)),
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