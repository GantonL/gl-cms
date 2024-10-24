import { t } from "$lib/i18n/translations";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const formType = event.params.form_type;
  const projectId = event.url.searchParams.get('project');
  const userId = event.url.searchParams.get('uid');
  return { 
    formType, 
    projectId, 
    userId,
    seo: {
      title: t.get(`common.forms_types.${formType}.title`),
      description: t.get(`common.forms_types.${formType}.description`),
    }
  }
}