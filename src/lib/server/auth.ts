import { Cookies } from "$lib/enums/cookies";
import type { RequestEvent } from "@sveltejs/kit";
import { isAdmin, setCustomClaims, verifyToken } from "./admin";

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
  return isAdmin(id);
}