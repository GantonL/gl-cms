import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { themeCookieName } from "$lib/configurations/theme";
import { Themes } from "$lib/enums/theme";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData(); 
  const newTheme = data.get(themeCookieName)?.toString();
  if (newTheme) {
    event.cookies.set(themeCookieName, newTheme, { path: '/'});
  }
  return json({success: true});
}

export const GET: RequestHandler = async (event) => {
  const theme = event.cookies.get(themeCookieName) || Themes.Default;
  return json({success: true, theme});
}
