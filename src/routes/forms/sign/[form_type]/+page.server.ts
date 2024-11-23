import { t } from "$lib/i18n/translations";
import { getProject } from "$lib/server/projects.db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const formType = event.params.form_type;
  const projectId = event.url.searchParams.get('project');
  const userId = event.url.searchParams.get('uid');
  let footer = ''; 
  let header = ''; 
  let projectUrl = '';
  if (projectId) {
    const project = await getProject(projectId);
    if (project?.settings) {
      footer = project.settings[project.type]?.forms?.footer ?? '';
    }
    if (project?.logo) {
      header = project.logo;
    }
    projectUrl = project?.url ?? '';
  }
  return { 
    formType, 
    projectId, 
    userId,
    footer,
    header,
    projectUrl,
    seo: {
      title: t.get(`common.forms_types.${formType}.title`),
      description: t.get(`common.forms_types.${formType}.description`),
    }
  }
}