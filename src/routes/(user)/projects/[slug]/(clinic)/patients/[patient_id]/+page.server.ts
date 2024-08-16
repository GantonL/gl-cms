import type { Project } from "$lib/models/project";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { ClinicPatient } from "$lib/models/clinic";
import { createPatient, getPatient, updatePatient, uploadImage } from "$lib/server/clinic.db";

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
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const patient: ClinicPatient | undefined = await createPatient(currentProject!, {
      first_name: form.data.first_name,
      sur_name: form.data.sur_name,
      personal_id: form.data.personal_id,
      email: form.data.email,
      address: form.data.address,
      date_of_birth: form.data.date_of_birth,
      phone: form.data.phone,
      gender: form.data.gender,
      refered_by: form.data.refered_by,
      notes: form.data.notes,
      medical_condition: form.data.medical_condition,
      medications: form.data.medications,
    });
    if (patient === undefined) {
      return fail(400, {form});
    }
    form.data.id = String(patient.id);
    return { form };
  },
  update: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const updatedPatient: Partial<Omit<ClinicPatient, 'id' | 'created_at'>> = {
      first_name: form.data.first_name,
      sur_name: form.data.sur_name,
      personal_id: form.data.personal_id,
      email: form.data.email,
      address: form.data.address,
      date_of_birth: form.data.date_of_birth,
      phone: form.data.phone,
      gender: form.data.gender,
      refered_by: form.data.refered_by,
      notes: form.data.notes,
      medical_condition: form.data.medical_condition,
      medications: form.data.medications,
    };
    const updateRes = await updatePatient(currentProject, form.data.id!, updatedPatient);
    if (!updateRes) {
      return fail(403, { form });
    }
    return { form };
  },
  'set-avatar': async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    if (!(formData.avatar as File).name) {
      return fail(403, { type: 'avatar', error: true, message: 'Invalid file data'})
    }
    const { avatar } = formData as { avatar: File };
    const patientId = event.params.patient_id;
    const uploadedAvatar = await uploadImage(currentProject, patientId, avatar);
    if (uploadedAvatar === undefined) {
      return fail(403, { type: 'avatar', error: true, message: 'Failed to updload patient avatar'});
    }
    const updateRes = await updatePatient(currentProject, patientId, { avatar: uploadedAvatar });
    if (!updateRes) {
      return fail(403, { type: 'avatar', error: true, message: 'Failed to update patient avatar data' });
    }
    return {  type: 'avatar', success: true };
  }
};