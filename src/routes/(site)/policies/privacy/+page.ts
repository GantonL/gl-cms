import type { PageLoad } from "./$types"
import { MarkdownResources } from "$lib/resources/markdown";
import { locale, t } from "$lib/i18n/translations";

export const load: PageLoad = async () => {
  const title = t.get('common.privacy_policy');
  const resourceId = `privacy-policy-${locale.get()}`;
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title,
      description: t.get('seo.privacy_policy_page_description'),
    }
  }
}
