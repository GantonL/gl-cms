import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { Project } from "$lib/models/project";
import { getContact, updateContactDetails } from "$lib/server/store.db";
import type { StoreContact } from "$lib/models/store";

let currentProject: Project | undefined;
let currentContactId: StoreContact['id'] | undefined;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const contact = await getContact(project);
  currentContactId = contact?.id;
  return {
    form: await superValidate(contact, zod(formSchema)),
    project,
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, 
        { form },
      );
    }
    const contactUpdated = await updateContactDetails(currentProject!, {id: currentContactId!, ...form.data});
    if (!contactUpdated) {
      return fail(400, 
        { form },
      );
    } 
    return { form };
  }
};