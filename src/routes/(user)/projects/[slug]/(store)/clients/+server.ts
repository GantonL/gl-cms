import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getClients } from "$lib/server/store.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";

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
  const page = Number(event.url.searchParams.get('page') ?? 1);
  const clients = await getClients(project, page);
  return json({
    clients
  })
}

// export async function DELETE(event: RequestEvent) {
//   const autheticatedUser = await getAuthenticatedUser(event);
//   if (!autheticatedUser) {
//     error(401, 'Unauthorized');
//   }
//   const deletedClient = await deleteClient();
//   return json({
//     success: !!deletedClient
//   })
// }