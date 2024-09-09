import { locale, t } from "$lib/i18n/translations";
import { MarkdownResources } from "$lib/resources/markdown";
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  const title = t.get('common.terms_and_conditions');
  const resourceId = `site-terms-${locale.get()}`;
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title,
      description: t.get('seo.terms_and_conditions_page_description'),
    }
  }
}
