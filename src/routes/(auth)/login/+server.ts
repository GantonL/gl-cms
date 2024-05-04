import { Cookies } from "$lib/enums/cookies";
import { getCustomClaims, setCustomClaims } from "$lib/server/admin";
import { getAuthenticatedUser } from "$lib/server/auth";
import { createUser, deleteUser, getUser, updateUser } from "$lib/server/users.db";
import type { User } from "$lib/models/user";
import { json, type RequestEvent } from "@sveltejs/kit"

export async function POST(event: RequestEvent) {
  const body = await event.request.formData();
  const authToken = body.get(Cookies.Session)?.toString();
  if (authToken) {
    event.cookies.set(Cookies.Session, authToken, { path: '/' });
    const authenticatedUser = await getAuthenticatedUser(event);
    if (authenticatedUser?.email) {
      const user = await getUser(authenticatedUser.email);
      if (!user) {
        return json({ success: false, error: {code: 403, message: 'Invalid user'} });
      }
      const updateUserObject: Partial<Pick<User, 'image'>> = {};
      if (user.id !== authenticatedUser.uid) {
        const oldId = user.id;
        user.id = authenticatedUser.uid;
        const userCreated = await createUser(user, authenticatedUser.uid);
        if (userCreated) {
          const deleteOldUser = await deleteUser(oldId);
          if (!deleteOldUser) {
            return json({ success: false, error: {code: 418, message: 'Failed to recreate user path'} });
          }
        }
      }
      if (!user?.image && authenticatedUser.picture) {
        updateUserObject.image = authenticatedUser.picture;  
        await updateUser(user.id, updateUserObject);
      }
      const customClaims = await getCustomClaims(authenticatedUser.uid);
      if (customClaims?.role !== user?.role) {
        await setCustomClaims(authenticatedUser.uid, { role: user.role });
      }
    }
  } else {
    event.cookies.delete(Cookies.Session, {path: '/'});
  }
  return json({ success: true });
}