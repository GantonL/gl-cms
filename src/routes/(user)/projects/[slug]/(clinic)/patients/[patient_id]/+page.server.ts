import type { Project } from "$lib/models/project";
import { fail, superValidate, withFiles } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { patientFileFormSchema, patientFormSchema, patientTreatmentFormSchema } from "./schema";
import type { ClinicPatient, ClinicTreatmentHistoryItem } from "$lib/models/clinic";
import { addPatientFiles, createPatient, getPatient, updatePatient, uploadAvatar, uploadFile, addPatientImages, createPatientTreatment } from "$lib/server/clinic.db";
import { ClinicStorageDirectories } from "$lib/enums/storage";

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
    const form = await superValidate(event, zod(patientFormSchema));
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
    const form = await superValidate(event, zod(patientFormSchema));
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
      refered_by: form.data.refered_by ?? '',
      notes: form.data.notes ?? '',
      medical_condition: form.data.medical_condition ?? '',
      medications: form.data.medications ?? '',
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
    const uploadedAvatar = await uploadAvatar(currentProject, patientId, avatar);
    if (uploadedAvatar === undefined) {
      return fail(403, { type: 'avatar', error: true, message: 'Failed to updload patient avatar'});
    }
    const updateRes = await updatePatient(currentProject, patientId, { avatar: uploadedAvatar });
    if (!updateRes) {
      return fail(403, { type: 'avatar', error: true, message: 'Failed to update patient avatar data' });
    }
    return { type: 'avatar', success: true };
  },
  'add-file': async (event) => {
    const form = await superValidate(event, zod(patientFileFormSchema));
    if (!form.valid) {
      return fail(400, 
        withFiles({ form }),
      );
    }
    if (!form.data.file) {
      return fail(400, 
        withFiles({ form }),
      );
    }
    const patientId = event.params.patient_id;
    const path = `${ClinicStorageDirectories.Files}/${patientId}/${form.data.file.name}`;
    const uploadedFile = await uploadFile(currentProject, path, form.data.file, form.data.date);
    if (uploadedFile === undefined) {
      return fail(403, { type: 'file', error: true, message: 'Failed to updload patient file'});
    }
    const updateRes = await addPatientFiles(currentProject, patientId, [uploadedFile]);
    if (!updateRes) {
      return fail(403, { type: 'file', error: true, message: 'Failed to update patient avatar data' });
    }
    return withFiles({ form });
  },
  'add-image': async (event) => {
    const form = await superValidate(event, zod(patientFileFormSchema));
    if (!form.valid) {
      return fail(400, 
        withFiles({ form }),
      );
    }
    if (!form.data.file) {
      return fail(400, 
        withFiles({ form }),
      );
    }
    const patientId = event.params.patient_id;
    const path = `${ClinicStorageDirectories.PatientsImages}/${patientId}/${form.data.file.name}`;
    const uploadedFile = await uploadFile(currentProject, path, form.data.file, form.data.date);
    if (uploadedFile === undefined) {
      return fail(403, { type: 'file', error: true, message: 'Failed to updload patient file'});
    }
    const updateRes = await addPatientImages(currentProject, patientId, [uploadedFile]);
    if (!updateRes) {
      return fail(403, { type: 'file', error: true, message: 'Failed to update patient avatar data' });
    }
    return withFiles({ form });
  },
  'create-treatment': async (event) => {
    const form = await superValidate(event, zod(patientTreatmentFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    if (!form.data.date) {
      return fail(400, { form });
    }
    const patientId = event.params.patient_id;
    if (!patientId) {
      return fail(400, { form });
    }
    const treatment: ClinicTreatmentHistoryItem | undefined = await createPatientTreatment(currentProject!, {
      patient_id: patientId,
      date: form.data.date!,
      documentation: form.data.documentation,
      notes: form.data.notes,
      price: form.data.price,
    });
    if (treatment === undefined) {
      return fail(400, {form});
    }
    form.data.id = String(treatment.id);
    return { form };
  }
};