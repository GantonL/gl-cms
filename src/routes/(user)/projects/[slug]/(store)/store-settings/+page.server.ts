import type { PageServerLoad } from "./$types";
import { getSettings } from "$lib/server/store.db";

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  const settings = await getSettings(project)
  return {
    settings,
    project
  }
}