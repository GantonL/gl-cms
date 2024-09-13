import { getUserCookiesPreferences } from "$lib/manage-cookies/manager";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const cookieBannerOpen = event.cookies.get('show-manage-cookies-banner');
  return {
    cookieBannerOpen,
    cookiePreferences: getUserCookiesPreferences(event),
  }
}
