import type { ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUserCookiesPreferences } from "$lib/manage-cookies/manager";
import { t } from "$lib/i18n/translations";

export const load: PageServerLoad = (event: ServerLoadEvent) => {
  return {
    preferences: getUserCookiesPreferences(event),
    seo: {
      title: t.get('common.manage_cookies'),
      description: t.get('seo.manage_cookies_page_description'),
    }
  }
}
