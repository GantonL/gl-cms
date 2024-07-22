import { getProductsCount } from "$lib/server/store.db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  const totalProducts = await getProductsCount(project);
  return {
    project,
    totalProducts,
  }
}
