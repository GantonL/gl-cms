import type { PageServerLoad } from "./$types";
import { getCategories } from "$lib/server/store.db";

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  const categories = await getCategories(project)
  return {
    categories,
    project
  }
}