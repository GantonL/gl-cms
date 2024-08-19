import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import { deleteFileOrDirectory, removePatientFiles, removePatientImages } from "$lib/server/clinic.db";
import type { RequestEvent } from "../$types";
import type { Image } from "$lib/models/image";
import { ClinicStorageDirectories } from "$lib/enums/storage";

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
  const deletedPatientFile = await deleteFileOrDirectory(project, path);
  if (!deletedPatientFile) {
    return json({success: false});
  }
  const mainSegment = path.split('/')[0];
  const fileOrImage: Image[] = [{ path, url, date: Number(date) }];
  if (mainSegment === ClinicStorageDirectories.Files) {
    const deleteFilesRefFromPatient = await removePatientFiles(project, patientId, fileOrImage);
    if (!deleteFilesRefFromPatient) {
      return json({success: false});
    }
  }
  if (mainSegment === ClinicStorageDirectories.PatientsImages) {
    const deleteImagesRefFromPatient = await removePatientImages(project, patientId, fileOrImage);
    if (!deleteImagesRefFromPatient) {
      return json({success: false});
    }  
  }
  return json({
    success: true
  })
}
