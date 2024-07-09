import type { Project } from "$lib/models/project";
import { getOrder } from "$lib/server/store.db";
import type { PageServerLoad } from "./$types";

let currentProject: Project;

export const load: PageServerLoad = async ({parent, params}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const order = await getOrder(project, Number(params.order_number));
  return {
    project,
    order,
  }
}