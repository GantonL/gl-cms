import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getOrders } from "$lib/server/store.db";
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
  const pageAfterIndex = Number(event.url.searchParams.get('pageAfterIndex') ?? -1);
  const pageSize = Number(event.url.searchParams.get('pageSize') ?? 10);
  const statusFilter = String(event.url.searchParams.get('status') ?? '');
  const orders = await getOrders(project, pageSize, pageAfterIndex, {path: 'status', value: statusFilter});
  return json({
    orders
  })
}
