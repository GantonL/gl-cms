import { ProjectType } from "$lib/enums/projects";
import { ClinicStorageDirectories } from "$lib/enums/storage";
import { t } from "$lib/i18n/translations";
import type { Project } from "$lib/models/project";
import { getAuthenticatedUser } from "$lib/server/auth";
import { addPatientFiles, uploadFile } from "$lib/server/clinic.db";
import { getProject } from "$lib/server/projects.db";
import { error, json, type RequestEvent } from "@sveltejs/kit";

const uploadSignedForm = async (project: Project, userId: string, blob: File, filename: string) => {
  let root = '';
  switch (project.type) {
    case ProjectType.Clinic:
      root = ClinicStorageDirectories.Files;
      break;
    case ProjectType.None:
      break;
    case ProjectType.Website:
      // WebsiteStorageDirectories.Files
      break;
    case ProjectType.Store:
      // StoreStorageDirectories.Files
      break;
  }
  const path = `${root}/${userId}/${filename}`;
  const uploadedFile = await uploadFile(project, path, blob);
  if (!uploadedFile) {
    return error(403);
  }
  let updateRes = false;
  switch (project.type) {
    case ProjectType.Clinic:
      updateRes = await addPatientFiles(project, userId, [uploadedFile]);
      if (!updateRes) {
        return error(403, { message: 'common.failed_to_update_patient_file' });
      }
      return updateRes;
    case ProjectType.None:
      return updateRes;
    case ProjectType.Website:
      return updateRes = true;
    case ProjectType.Store:
      return updateRes = true;
  }
}

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const data = await event.request.formData(); 
  const projectId = data.get('projectId')?.toString();
  if (projectId === null || projectId === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const blob = data.get('blob') as File;
  if (blob === null || blob === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const userId = data.get('userId')?.toString();
  if (userId === null || userId === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const filename = data.get('filename')?.toString();
  if (filename === null || filename === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const uploaded = await uploadSignedForm(project, userId, blob, filename);
  return json({
    success: !!uploaded
  })
}
