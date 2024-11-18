import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { editFormSchema, formSchema } from "./schema";
import { createProject, getProjects, updateProject, uploadFile } from "$lib/server/projects.db";
import type { PageServerLoad } from "./$types";
import { getUser } from "$lib/server/users.db";
import { UserPermissions } from "$lib/enums/permission";
import type { ProjectType } from "$lib/enums/projects";
import { t } from "$lib/i18n/translations";
import { withFiles } from "sveltekit-superforms/server";
import type { Image } from "$lib/models/image";
import { ProjectsStorageDirectories } from "$lib/enums/storage";

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
  if (projects?.length === 1) {
    redirect(300, `projects/${projects[0].id}`);
  }
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
      return fail(400, 
        withFiles({
          form,
        }));
    }
    const projectCreated = await createProject({
      name: form.data.name,
      url: form.data.url,
      type: form.data.type as ProjectType,
    });
    if (!projectCreated) {
      return fail(400, 
        withFiles({
          form,
        }));
    }
    let logo: Image | undefined;
    if (form.data.logoFile) {
      const path = `${ProjectsStorageDirectories.Projects}/${projectCreated.id}/${ProjectsStorageDirectories.Logo}/${form.data.logoFile.name}`;
      logo = await uploadFile(path, form.data.logoFile);
      if (!logo) {
        return fail(400, 
          withFiles({
            form,
          }));
      }
      await updateProject(projectCreated.id!, {
        logo,
      });
    }
    return {
      form,
    };
  },
  edit: async (event) => {
    const form = await superValidate(event, zod(editFormSchema));
    if (!form.valid) {
      return fail(400, 
        withFiles({
          form,
        }));
    }
    if (!form.data.id) {
      return fail(400, 
        withFiles({
          form,
        }));  
    }
    let logo: Image | undefined;
    if (form.data.logoFile) {
      const path = `${ProjectsStorageDirectories.Projects}/${form.data.id}/${ProjectsStorageDirectories.Logo}/${form.data.logoFile.name}`;
      logo = await uploadFile(path, form.data.logoFile)
    }
    const projectUpdated = await updateProject(form.data.id!, {
      display_name: form.data.display_name,
      url: form.data.url,
      logo,
    });
    if (!projectUpdated) {
      return fail(400, 
        withFiles({
          form,
        }));
    }
    return withFiles({
        form,
      });
  }
};