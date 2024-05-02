import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import { createProject, getProjects } from "$lib/server/projects.db";

export const load: PageServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  if (!isAdmin) {
    error(403, 'Forbidden');
  }
  const projects = await getProjects();
  return {
    form: await superValidate(zod(formSchema)),
    projects: projects ?? [],
    seo: {
      title: 'Admin - Projects',
    }
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const userCreated = await createProject({
      name: form.data.name,
    });
    if (!userCreated) {
      return fail(400, {form});
    }
    return {
      form,
    };
  },
};