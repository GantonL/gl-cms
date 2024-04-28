import { MarkdownResources } from "$lib/resources/markdown";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const title = "Cookies Policy";
  const resourceId = 'cookies-policy';
  const file = MarkdownResources[resourceId].file;
  const content = await file[MarkdownResources[resourceId].path].default;  
  return {
    title,
    content,
    seo: {
      title: 'Cookies Policy',
      description: 'Cookies Policy of this application',
    }
  }
}
