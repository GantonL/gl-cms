import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { t } from "$lib/i18n/translations";
import { getUser } from "$lib/server/users.db";
import { getProject } from "$lib/server/projects.db";
import { FormType } from "$lib/enums/form-type";
import { createFormTemplate } from "$lib/server/forms.db";

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, t.get('common.unauthorized'));
  }
  const data = await event.request.formData(); 
  const projectId = data.get('project_id')?.toString();
  if (projectId === null || projectId === undefined) {
    error(404, t.get('common.invalid_fields'));
  }
  const formTemplateType = data.get('form_type')?.toString() as FormType;
  if (formTemplateType === null || formTemplateType === undefined || !Object.values(FormType).includes(formTemplateType)) {
    error(404, t.get('common.invalid_fields'));
  }
  const project = await getProject(projectId);
  if (project === null) {
    error(404, t.get('common.project_not_found'))
  }
  const isAdmin = await isAdminUser(autheticatedUser.uid);
  const user = await getUser(autheticatedUser.email!);
  if (!isAdmin && !user?.projects?.includes(project!.name)) {
    error(401, t.get('common.unauthorized'));
  }
  const formAdded = await createFormTemplate(projectId, { type: formTemplateType });
  return json({
    success: !!formAdded
  })
}