import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { defaultLocale, expirationDays, languageCookieName } from "$lib/configurations/language";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData(); 
  const newLocal = data.get(languageCookieName)?.toString();
  if (newLocal) {
    event.cookies.set(languageCookieName, newLocal, {expires: new Date(Date.now() + expirationDays), path: '/'});
  }
  return json({success: true});
}

export const GET: RequestHandler = async (event) => {
  const locale = event.cookies.get(languageCookieName) || defaultLocale;
  return json({success: true, locale});
}
