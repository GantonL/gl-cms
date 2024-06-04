import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import { StoreCollections } from "$lib/enums/collections";
import { type StoreSettings, type StoreCategory } from "$lib/models/store";
import { error } from "@sveltejs/kit";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { StoreStorageDirectories } from "$lib/enums/storage";
import { uuidv4 } from '@firebase/util';
import type { Image } from "$lib/models/image";

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

export const updateSettings = async (project: Project, settings: Pick<StoreSettings, 'id'> & Partial<Pick<StoreSettings, 'active' | 'banner' | 'global_discount'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return error(500) };
  const settingsCollectionRef = getFirestore(app).collection(StoreCollections.Settings);
  const updateRes = await settingsCollectionRef.doc(settings.id).set(settings, { merge: true });
  return !!updateRes;
}

export const getCategories = async (project: Project): Promise<StoreCategory[]> => {
  const categories: StoreCategory[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return categories };
  const categoriesCollectionRef = getFirestore(app).collection(StoreCollections.Categories);
  const categoriesRes = await categoriesCollectionRef.orderBy('display_location').get();
  if (!categoriesRes || categoriesRes.empty) {
    return categories;
  }
  categories.push(...categoriesRes.docs.map(doc => doc.data() as StoreCategory))
  return categories;
}

export const createCategory = async (project: Project, category: Pick<StoreCategory, 'title' | 'display_location' | 'discount' | 'children'>): Promise<StoreCategory | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const categoriesCollectionRef = getFirestore(app).collection(StoreCollections.Categories);
  const newCategory: StoreCategory = {
    id: uuidv4(),
    title: category.title,
    display_location: category.display_location,
    discount: category.discount ?? 0,
    children: category.children ?? [],
    created_at: new Date().getTime(),
  };
  const addRes = await categoriesCollectionRef.add(newCategory);
  return addRes?.id ? newCategory : undefined;
} 

export const updateCategory = async (project: Project, id: string, category: Partial<StoreCategory>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(StoreCollections.Categories).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set(category, { merge: true });
  return !!setRes;
}

export const uploadCategoryImage = async (project: Project, id: string, image: File): Promise<Image | undefined> => {
  let uploadedImage: Image | undefined = {path: '', url: ''};
  const app = getSecondaryApp(project);
  if (!app) { return uploadedImage };
  const bucket = getStorage(app).bucket();
  const buffer = Buffer.from(await image.arrayBuffer());
  try {
    uploadedImage.path = `${StoreStorageDirectories.Catgories}/${id}`;
    const fileRef = bucket.file(uploadedImage.path);
    await fileRef.save(buffer);
    uploadedImage.url = await getDownloadURL(fileRef);
  } catch {
    uploadedImage = undefined;
  }
  return uploadedImage;
}