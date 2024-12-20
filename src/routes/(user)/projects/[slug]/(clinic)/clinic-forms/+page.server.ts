import { getFormsTemplates } from "$lib/server/forms.db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
    const parentData = await parent();
    const project = parentData.project;
    const forms = await getFormsTemplates(project.id);
    return {
        project,
        forms,
    }
}
