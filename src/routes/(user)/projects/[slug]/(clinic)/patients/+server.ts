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
  const nameOrIDQuery = String(event.url.searchParams.get('q') ?? '');
  let filter: {path: keyof ClinicPatient, value: string | number} | undefined;
  if (nameOrIDQuery.length > 0) {
    if (/^\d{9}$/.test(nameOrIDQuery)) {
      filter = {
        path: 'personal_id',
        value: nameOrIDQuery,
      }
    } else if (nameOrIDQuery.includes("@")) {
      filter = {
        path: 'email',
        value: nameOrIDQuery,
      }
    } else if (nameOrIDQuery.split(' ').length === 1) {
      filter = {
        path: 'first_name',
        value: nameOrIDQuery,
      }
    } else {
      filter = {
        path: 'full_name',
        value: nameOrIDQuery,
      }
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
