import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
    const parentData = await parent();
    const project = parentData.project;
    const settings = project.settings?.clinic;
    return {
        project,
        settings,
    }
}
