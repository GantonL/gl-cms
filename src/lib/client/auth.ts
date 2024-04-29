import { Cookies } from "$lib/enums/cookies";
import { getApp, initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../configurations/firebase";
import { getAuth } from "firebase/auth";

export const setAuth = (token?: string) => {
  if (!token) { token = '' };
  const body = new FormData();
  body.set(Cookies.Session, token);
  fetch('/login', {
    method: 'POST',
    body,
  });
}

export const app = () => {
  try {
    return getApp();
  } catch {
    return initializeApp(FIREBASE_CONFIG);
  }
}

export const auth = () => {
  return getAuth(app())
}