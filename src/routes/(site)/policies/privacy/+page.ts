import type { PageLoad } from "./$types"
import { MarkdownResources } from "$lib/resources/markdown";

export const load: PageLoad = async () => {
  const title = "Privacy Policy";
  const resourceId = 'privacy-policy';
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title: 'Privacy Policy',
      description: 'Privacy policy of this application',
    }
  }
}
