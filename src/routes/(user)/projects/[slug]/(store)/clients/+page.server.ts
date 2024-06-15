import { getClientsCount } from "$lib/server/store.db";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  const totalClients = await getClientsCount(project);
  return {
    project,
    totalClients,
  }
}
