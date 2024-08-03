import { getPatientsCount } from "$lib/server/clinic.db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
    const parentData = await parent();
    const project = parentData.project;
    const totalPatients = await getPatientsCount(project);
    return {
        project,
        totalPatients,
    }
}
