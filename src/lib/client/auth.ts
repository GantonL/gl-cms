import { Cookies } from "$lib/enums/cookies";
import { getApp, initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../configurations/firebase";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, type User } from "firebase/auth";
import { user } from "./stores";

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
  return getAuth(app());
}

export const initializeAuthentication = () => {
  const authentication = auth();
  setPersistence(authentication, browserLocalPersistence);
  onAuthStateChanged(authentication, (currentUser: User | null) => {
    currentUser?.getIdTokenResult(true)?.then((tokenRes) => {
      setAuth(tokenRes?.token);
      user.set(currentUser);
    });
  });
}