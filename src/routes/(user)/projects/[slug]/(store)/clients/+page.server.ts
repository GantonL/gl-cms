import { createClient, getClientsCount } from "$lib/server/store.db";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { Project } from "$lib/models/project";
import type { StoreClient } from "$lib/models/store";

let currentProject: Project;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const totalClients = await getClientsCount(project);
  return {
    project,
    totalClients,
  }
}

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const client: StoreClient | undefined = await createClient(currentProject!, {
      name: form.data.name,
      email: form.data.email,
      home_address: form.data.home_address,
      shipping_address: form.data.shipping_address,
      phone_number: form.data.phone_number,
      date_of_birth: form.data.date_of_birth,
    });
    if (client === undefined) {
      return fail(400, {form});
    }
    return { form };
  },
  update: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return { form };
  }
};