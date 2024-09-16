import type { RequestEvent } from "./$types";
import { error, json } from "@sveltejs/kit";
import { getProject, updateProject } from "$lib/server/projects.db";
import { getAuthenticatedUser } from "$lib/server/auth";
import type { ClinicSettings } from "$lib/models/clinic";

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'common.unauthorized');
  }
  const updateObject: ClinicSettings = {};
  const body = await event.request.formData();
  const settings = JSON.parse(body.get('settings')?.toString() ?? '{}');
  if (settings !== undefined && settings !== null) {
    if (settings.treatment_documentation_template !== undefined) {
      updateObject.treatment_documentation_template = settings.treatment_documentation_template;
    }
  }
  if (!Object.keys(updateObject).length) {
    return error(400, {message: 'Missing data'});
  }
  const project = await getProject(event.params.slug);
  if (project === null) {
    return error(404, {message: 'Project does not exists'});
  }
  const success = await updateProject(project.id, { settings: { clinic: updateObject } });
  return json({success});
}
