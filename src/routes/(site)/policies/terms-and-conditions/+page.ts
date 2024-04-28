import { MarkdownResources } from "$lib/resources/markdown";
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  const title = "Terms & Conditions";
  const resourceId = 'site-terms';
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title,
      description: 'Terms & Conditions of this application',
    }
  }
}
