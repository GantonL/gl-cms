import type { Project } from "$lib/models/project";
import { getOrdersCount } from "$lib/server/store.db";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project: Project = parentData.project;
  const totalOrders = await getOrdersCount(project);
  return {
    project,
    totalOrders,
  }
}
