import type { Project } from "$lib/models/project";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { ClinicPatient } from "$lib/models/clinic";
import { getPatient } from "$lib/server/clinic.db";

let currentProject: Project;

export const load: PageServerLoad = async ({parent, params}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  let patient: Partial<ClinicPatient> | undefined = {};
  if (params.patient_id !== 'new') {
    patient = await getPatient(project, String(params.patient_id));
  }
  return {
    project,
    patient,
  }
}

export const actions: Actions = {
  // create: async (event) => {
  //   const form = await superValidate(event, zod(formSchema));
  //   if (!form.valid) {
  //     return fail(400, { form });
  //   }
  //   const patient: ClinicPatient | undefined = await createPatient(currentProject!, {
      
  //   });
  //   if (patient === undefined) {
  //     return fail(400, {form});
  //   }
  //   form.data.id = String(patient.id);
  //   return { form };
  // },
  // update: async (event) => {
  //   const form = await superValidate(event, zod(formSchema));
  //   if (!form.valid) {
  //     return fail(400, { form });
  //   }
  //   const updatePatient: Partial<Omit<ClinicPatient, 'id' | 'created_at'>> = {

  //   };
  //   const updateRes = await updatePatient(currentProject, form.data.id!, updatePatient);
  //   if (!updateRes) {
  //     return fail(403, { form });
  //   }
  //   return { form };
  // }
};