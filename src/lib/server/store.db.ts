import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import { StoreCollections } from "$lib/enums/collections";
import { type StoreSettings } from "$lib/models/store";
import { error } from "@sveltejs/kit";

export const getSettings = async (project: Project): Promise<StoreSettings | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const settingsCollectionRef = getFirestore(app).collection(StoreCollections.Settings);
  const settingsDocs = await settingsCollectionRef.listDocuments();
  if (!settingsDocs?.length) { return; }
  const data = (await settingsDocs[0].get()).data() as StoreSettings;
  data.id = settingsDocs[0].id;
  return data;
}

export const updateSettings = async (project: Project, settings: Pick<StoreSettings, 'id'> & Partial<Pick<StoreSettings, 'active' | 'bunner' | 'global_discount'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return error(500) };
  const settingsCollectionRef = getFirestore(app).collection(StoreCollections.Settings);
  const updateRes = await settingsCollectionRef.doc(settings.id).set(settings, { merge: true });
  return !!updateRes;
}

