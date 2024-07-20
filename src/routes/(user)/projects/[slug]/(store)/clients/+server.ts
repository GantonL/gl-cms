import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { deleteClient, getClients, getClientsCount } from "$lib/server/store.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import type { StoreClient } from "$lib/models/store";

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
  const queries: Partial<Record<keyof StoreClient, string | number>> = {};
  if (nameOrEmailQuery.length > 0) {
    if (nameOrEmailQuery.includes('@')) {
      queries.email = nameOrEmailQuery;
    } else {
      queries.name = nameOrEmailQuery;
    }
  }
  const shouldCount = event.url.searchParams.get('count');
  let totalCount;
  if (shouldCount) {
    totalCount = await getClientsCount(project, queries); 
  }
  const clients = await getClients(project, pageSize, pageAfterIndex, queries);
  return json({
    clients,
    totalCount,
  })
}

export async function DELETE(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const projectId = event.params.slug ?? String(event.url.searchParams.get('project') ?? '');
  const project = await getProject(projectId);
  if (project === null) {
    error(404, 'Project not found')
  }
  const requestFormData = await event.request.formData();
  const clientId = requestFormData.get('id')?.toString();
  if (!clientId?.length) {
    error(400, 'Missing client id')
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const deletedClient = await deleteClient(project, clientId);
  return json({
    success: !!deletedClient
  })
}
