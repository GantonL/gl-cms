import { getAuthenticatedUser } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, RequestEvent } from "./$types";

export const load: PageServerLoad = async (event: RequestEvent) => {
  const authenticatedUser = await getAuthenticatedUser(event);
  if (authenticatedUser) {
    redirect(300, '/');
  }
  return {
    seo: {
      title: 'Login',
    }
  }
}
