import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import { StoreCollections } from "$lib/enums/collections";
import { type StoreSettings, type StoreCategory, type StoreContact, type StoreClient } from "$lib/models/store";
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

export const deleteCategoryImage = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const bucket = getStorage(app).bucket();
  const fileRef = bucket.file(`${StoreStorageDirectories.Catgories}/${id}`);
  const deleteRes = await fileRef.delete();
  return !!deleteRes?.at(0);
}

export const deleteCategory = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const categoriesCollectionRef = getFirestore(app).collection(StoreCollections.Categories);
  const categoryRes = await categoriesCollectionRef.where('id', '==', id).get();
  const categoryDoc = categoryRes?.docs?.pop();
  if (!categoryDoc?.exists) { return false; };
  const categoryData = categoryDoc.data();
  if (!categoryData?.image) {
    const deleteRes = await categoryDoc.ref.delete();
    return !!deleteRes;
  }
  const deleteImageRes = await deleteCategoryImage(project, id);
  if (deleteImageRes) {
    const deleteRes = await categoryDoc.ref.delete();
    return !!deleteRes;
  }
  return false;
}

export const getContact = async (project: Project): Promise<StoreContact | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const contactCollectionRef = getFirestore(app).collection(StoreCollections.Contact);
  const contactDocs = await contactCollectionRef.listDocuments();
  if (!contactDocs?.length) { return; }
  const data = (await contactDocs[0].get()).data() as StoreContact;
  data.id = contactDocs[0].id;
  return data;
}

export const updateContactDetails = async (project: Project, contact: Pick<StoreContact, 'id'> & Partial<Pick<StoreContact, 'name' | 'address' | 'email' | 'phone_number' | 'embeded_map_url' | 'navigation_url'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const contactCollectionRef = getFirestore(app).collection(StoreCollections.Contact);
  const updateRes = await contactCollectionRef.doc(contact.id).set(contact, { merge: true });
  return !!updateRes;
}

export const getClients = async (project: Project, page: number): Promise<StoreClient[]> => {
  const clients: StoreClient[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return clients };
  const clientsCollectionRef = getFirestore(app).collection(StoreCollections.Clients);
  const clientsRes = await clientsCollectionRef.orderBy('created_at').get();
  if (!clientsRes || clientsRes.empty) {
    return clients;
  }
  clients.push(...clientsRes.docs.map(doc => doc.data() as StoreClient))
  return clients;
}

export const deleteClient = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const clientsCollectionRef = getFirestore(app).collection(StoreCollections.Clients);
  const clientRes = await clientsCollectionRef.where('id', '==', id).get();
  const clientDoc = clientRes?.docs?.pop();
  if (!clientDoc?.exists) { return false; };
  const deleteRes = await clientDoc.ref.delete();
  return !!deleteRes;
}