import type { Project } from "$lib/models/project";
import { cert, getApp, initializeApp } from "firebase-admin/app";
import { PROJECTS_KEYS } from "./configurations";

export const getSecondaryApp = (project: Project) => {
  try {
    return getApp(project.name);
  } catch {
    const keys = PROJECTS_KEYS[project.name];
    if (keys) {
      return initializeApp({
        credential: cert({
          projectId: keys['fb-project-id'],
          clientEmail: keys['fb-client-email'],
          privateKey: keys['fb-private-key'].replace(/\\n/gm, "\n"),
        }),
        storageBucket: keys['fb-storage-bucket'],
      }
      , project.name);
    }
    return;
  }
}