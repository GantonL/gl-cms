import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import { deleteFile, removePatientFiles } from "$lib/server/clinic.db";
import type { RequestEvent } from "../$types";
import type { ClinicPatient } from "$lib/models/clinic";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const project = await getProject(event.params.slug);
  if (project === null) {
    error(404, 'Project not found')
  }
  const patientId = event.params.patient_id;
  if (!patientId?.length) {
    error(400, 'Missing patient id')
  }
  const requestFormData = await event.request.formData();
  const path = requestFormData.get('path')?.toString();
  if (!path?.includes(patientId)) {
    error(401, 'Unauthorized')
  }
  const url = requestFormData.get('url')?.toString();
  if (!url) {
    error(400, 'Missing file url');
  }
  const date = requestFormData.get('date')?.toString();
  if (!date) {
    error(400, 'Missing file date');
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const deletedPatientFile = await deleteFile(project, path);
  if (!deletedPatientFile) {
    return json({success: false});
  }
  const patientFile: ClinicPatient['files'] = [{ path, url, date: Number(date) }];
  const deleteFilesRefFromPatient = await removePatientFiles(project, patientId, patientFile);
  if (!deleteFilesRefFromPatient) {
    return json({success: false});
  }
  return json({
    success: true
  })
}
