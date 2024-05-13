import type { Project } from "$lib/models/project";
import { getApp, initializeApp } from "firebase/app";

export const getSecondaryApp = (project: Project) => {
  try {
    return getApp(project.name);
  } catch {
    if (project.credentails) {
      return initializeApp(project.credentails, project.name);
    }
    return;
  }
}