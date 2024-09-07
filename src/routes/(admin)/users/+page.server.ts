import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createUser, getUsers } from "$lib/server/users.db";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { UserRole } from "$lib/enums/user-role";
import { getProjects } from "$lib/server/projects.db";
import { t } from "$lib/i18n/translations";

export const load: PageServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  if (!isAdmin) {
    error(403, t.get('common.forbidden'));
  }
  const users = await getUsers();
  const projects = await getProjects();
  return {
    form: await superValidate(zod(formSchema)),
    users: users ?? [],
    projects: projects?.map(p=>p.name) ?? [],
    seo: {
      title: t.get('common.admin') + ' - ' + t.get('common.users')
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
    const userCreated = await createUser({
      name: form.data.name,
      email: form.data.email,
      role: form.data.role as UserRole,
      projects: form.data.projects,
    });
    if (!userCreated) {
      return fail(400, {form});
    }
    return {
      form,
    };
  },
};