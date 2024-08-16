import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import type { ClinicPatient } from "$lib/models/clinic";
import { getPatients, getPatientsCount } from "$lib/server/clinic.db";

export async function GET(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const projectId = event.params.slug ?? String(event.url.searchParams.get('project') ?? '');
  const project = await getProject(projectId);
  if (project === null) {
    error(404, 'Project not found')
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const pageAfterIndex = Number(event.url.searchParams.get('pageAfterIndex') ?? -1);
  const pageSize = Number(event.url.searchParams.get('pageSize') ?? 10);
  const nameOrEmailQuery = String(event.url.searchParams.get('q') ?? '');
  let filter: {path: keyof ClinicPatient, value: string | number} | undefined;
  if (nameOrEmailQuery.length > 0) {
    filter = {
      path: nameOrEmailQuery.includes('@') ? 'email' : 'full_name',
      value: nameOrEmailQuery,
    }
  }
  const shouldCount = event.url.searchParams.get('count');
  let totalCount;
  if (shouldCount) {
    totalCount = await getPatientsCount(project, filter); 
  }

  const patients = await getPatients(project, pageSize, pageAfterIndex, filter);
  return json({
    patients,
    totalCount
  })
}
