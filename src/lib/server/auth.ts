import { Cookies } from "$lib/enums/cookies";
import type { RequestEvent } from "@sveltejs/kit";
import { setCustomClaims, verifyToken, getCustomClaims } from "./admin";
import { UserRole } from "$lib/enums/user-role";

export const getAuthenticatedUser = async (event: RequestEvent) => {
  const token = event.cookies.get(Cookies.Session);
  if (!token) {
    return;
  }
  try {
    const user = await verifyToken(token);
    return user;
  } catch (err) {
    console.error(err)
    return;
  }
}

export const setAdminUser = async (id: string) => {
  return setCustomClaims(id, {admin: true});
}

export const isAdminUser = async (id: string) => {
  return (await getCustomClaims(id))?.role === UserRole.Admin;
}

export const getUserCustomClaims = async (uid: string) => {
  return getCustomClaims(uid);
}