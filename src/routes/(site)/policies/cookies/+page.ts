import { locale, t } from "$lib/i18n/translations";
import { MarkdownResources } from "$lib/resources/markdown";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const title = t.get('common.cookie_policy');
  const resourceId = `cookies-policy-${locale.get()}`;
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title,
      description: t.get('common.cookie_policy_page_description'),
    }
  }
}
