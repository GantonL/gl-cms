import { cert, getApp, initializeApp } from "firebase-admin/app"
import { FIREBASE_CONFIG } from "../../configurations/firebase"
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_STORAGE_BUCKET} from "$env/static/private";
import { getAuth } from "firebase-admin/auth";

export const app = () => {
  try {
    return getApp();
  } catch {
    return initializeApp({
      credential: cert({
        projectId: FIREBASE_CONFIG.projectId,
        clientEmail: FB_CLIENT_EMAIL,
        privateKey: FB_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      }),
      storageBucket: FB_STORAGE_BUCKET,
    });
  }
}

export const verifyToken = async (token: string) => {
  const application = app();
  const auth = getAuth(application);
  return auth.verifyIdToken(token, false);
}

export const setCustomClaims = async (uid: string, claims: object) => {
  const application = app();
  const auth = getAuth(application);
  return auth.setCustomUserClaims(uid, claims);
}

export const getCustomClaims = async (uid: string) => {
  const application = app();
  const auth = getAuth(application);
  const user = await auth.getUser(uid);
  return user?.customClaims;
}
