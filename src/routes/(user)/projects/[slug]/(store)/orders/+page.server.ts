import type { Project } from "$lib/models/project";
import type { PageServerLoad } from "./$types";

let currentProject: Project;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const totalOrders = 0 // await getOrdersCount(project);
  return {
    project,
    totalOrders,
  }
}
