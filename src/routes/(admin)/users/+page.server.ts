import { getAuthenticatedUser, isAdminUser } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUsers } from "$lib/server/users.db";

export const load: PageServerLoad = async (event) => {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  // const isAdmin = await isAdminUser(autheticatedUser.uid);
  // if (!isAdmin) {
  //   error(403, 'Forbidden');
  // }
  const users = await getUsers();
  return {
    users: users ?? [],
    seo: {
      title: 'Admin - Users',
    }
  }
}
