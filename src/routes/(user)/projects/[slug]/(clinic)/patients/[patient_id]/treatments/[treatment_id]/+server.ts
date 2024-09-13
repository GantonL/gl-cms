import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { getProject } from "$lib/server/projects.db";
import { getUser } from "$lib/server/users.db";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { deletePatientTreatment } from "$lib/server/clinic.db";
import { t } from "$lib/i18n/translations";

export async function DELETE(event: RequestEvent) {
    const autheticatedUser = await getAuthenticatedUser(event);
    if (!autheticatedUser) {
      error(401, t.get('common.unauthorized'));
    }
    const project = await getProject(event.params.slug);
    if (project === null) {
      error(404, t.get('common.project_not_found'))
    }
    const patientId = event.params.patient_id;
    if (!patientId?.length) {
      error(400, t.get('common.missing_patient_id'))
    }
    const isAdmin = await isAdminUser(autheticatedUser.uid);
    const user = await getUser(autheticatedUser.email!);
    if (!isAdmin && !user?.projects?.includes(project!.name)) {
      error(401, t.get('common.unauthorized'));
    }
    const treatmentDeleted = await deletePatientTreatment(project, patientId, event.params.treatment_id);
    return json({
      success: !!treatmentDeleted
    });
  }
  