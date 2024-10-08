import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { deletePatient } from "$lib/server/clinic.db";
import { t } from "$lib/i18n/translations";

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const projectId = event.params.slug ?? String(event.url.searchParams.get('project') ?? '');
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const requestFormData = await event.request.formData();
  const patientId = requestFormData.get('id')?.toString();
  if (!patientId?.length) {
    error(400, t.get('common.missing_patient_id'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, t.get('common.unauthorized'));
  }
  const deletedPatient = await deletePatient(project, patientId);
  return json({
    success: !!deletedPatient
  })
}
