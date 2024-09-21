import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, fail, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { editFormSchema, formSchema } from "./schema";
import { createProject, getProjects, updateProject } from "$lib/server/projects.db";
import type { PageServerLoad } from "./$types";
import { getUser } from "$lib/server/users.db";
import { UserPermissions } from "$lib/enums/permission";
import type { ProjectType } from "$lib/enums/projects";
import { t } from "$lib/i18n/translations";

export const load: PageServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  let names: string[] | undefined;
  const permissions: UserPermissions[] = [];
  if (!isAdmin) {
    names = (await getUser(autheticatedUser.email!))?.projects;
  } else {
    permissions.push(UserPermissions.CreateProject);
    permissions.push(UserPermissions.DeleteProject);
  }
  const projects = await getProjects(names);
  return {
    form: await superValidate(zod(formSchema)),
    projects,
    permissions,
    seo: {
      title: t.get('common.projects'),
    }
  }
}

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const projectCreated = await createProject({
      name: form.data.name,
      url: form.data.url,
      type: form.data.type as ProjectType,
    });
    if (!projectCreated) {
      return fail(400, {form});
    }
    return {
      form,
    };
  },
  edit: async (event) => {
    const form = await superValidate(event, zod(editFormSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    if (!form.data.id) {
      return fail(400, {
        form,
      });  
    }
    const projectUpdated = await updateProject(form.data.id!, {
      display_name: form.data.display_name,
      url: form.data.url,
    });
    if (!projectUpdated) {
      return fail(400, {form});
    }
    return {
      form,
    };
  }
};