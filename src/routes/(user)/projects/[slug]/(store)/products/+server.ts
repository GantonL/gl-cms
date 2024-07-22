import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { deleteProduct, getProducts, getProductsCount } from "$lib/server/store.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import type { StoreProduct } from "$lib/models/store";

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
  const nameOrSerialNumberQuery = String(event.url.searchParams.get('q') ?? '');
  let filter: {path: keyof StoreProduct, value: string | number} | undefined;
  if (nameOrSerialNumberQuery.length > 0) {
    filter = {
      path: /^[0-9]$/.test(nameOrSerialNumberQuery) ? 'serial_number' : 'name',
      value: nameOrSerialNumberQuery,
    }
  }
  const shouldCount = event.url.searchParams.get('count');
  let totalCount;
  if (shouldCount) {
    totalCount = await getProductsCount(project, filter); 
  }
  const products = await getProducts(project, pageSize, pageAfterIndex, filter);
  return json({
    products,
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
  const productId = requestFormData.get('id')?.toString();
  if (!productId?.length) {
    error(400, 'Missing client id')
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, 'Unauthorized');
  }
  const deletedProduct = await deleteProduct(project, productId);
  return json({
    success: !!deletedProduct
  })
}
