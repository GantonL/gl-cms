import { getStorage } from "firebase-admin/storage";
import { getSecondaryApp } from "./secondary.db";
import type { Project } from "$lib/models/project";

export const getFiles = async (project: Project, folder?: string) => {
  try {
    const storage = getStorage(getSecondaryApp(project));
    const bucket = storage.bucket();
    const [images] = await bucket.getFiles({prefix: folder, autoPaginate: true});
    return images.slice(1).map(file => file.name);
  } catch {
    return null;
  } 
}

