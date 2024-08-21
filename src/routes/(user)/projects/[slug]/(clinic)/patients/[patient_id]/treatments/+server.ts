import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { getPatientTreatmentsHistory } from "$lib/server/clinic.db";

export async function GET(event: RequestEvent) {
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
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const treatmentsHistory = await getPatientTreatmentsHistory(project, patientId);
  return json({
    treatmentsHistory
  });
}

export async function POST(event: RequestEvent) {
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
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const treatment = true // await createPatientTreatment(project, patientId);
  return json({
    success: !!treatment
  });
}

export async function PATCH(event: RequestEvent) {
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
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const treatmentUpdated = true // await updatePatientTreatment(project, patientId);
  return json({
    success: !!treatmentUpdated
  });
}

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
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const treatmentDeleted = true // await deletePatientTreatment(project, patientId);
  return json({
    success: !!treatmentDeleted
  });
}
