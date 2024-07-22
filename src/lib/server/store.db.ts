import type { Project } from "$lib/models/project";
import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import { StoreCollections } from "$lib/enums/collections";
import { type StoreSettings, type StoreCategory, type StoreContact, type StoreOrder, type StoreClient, type StoreProduct } from "$lib/models/store";
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

export const getClientsCount = async (project: Project, filter?: {path: keyof StoreClient, value: string | number}): Promise<number | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const clientsCollectionRef = getFirestore(app).collection(StoreCollections.Clients);
  let cursor;
  if (filter && (filter.value)) {
    cursor = clientsCollectionRef.where(filter.path, '==', filter.value);
  }
  const countQuery = await (cursor ?? clientsCollectionRef).count().get();
  return countQuery.data().count;
}

export const getClients = async (project: Project, limit: number, startAfter?: number | string | Document, filter?: {path: keyof StoreClient, value: string | number}): Promise<StoreClient[]> => {
  const clients: StoreClient[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return clients };
  const clientsCollectionRef = getFirestore(app).collection(StoreCollections.Clients);
  let clientsCursor = clientsCollectionRef.orderBy('created_at', 'desc');
  if (startAfter !== undefined && (typeof startAfter === 'number' && startAfter > -1)) {
    clientsCursor = clientsCursor.startAfter(startAfter);
  }
  if (filter && (filter.value)) {
    clientsCursor = clientsCollectionRef.where(filter.path, '==', filter.value);
  }
  const clientsRes = await clientsCursor.limit(limit).get();
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

export const createClient = async (project: Project, client: Pick<StoreClient, 'name' | 'email' | 'home_address' | 'shipping_address' | 'date_of_birth' | 'phone_number'>): Promise<StoreClient | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const clientsCollectionRef = getFirestore(app).collection(StoreCollections.Clients);
  const newClient: StoreClient = {
    id: uuidv4(),
    created_at: new Date().getTime(),
    name: client.name,
    home_address: client.home_address,
    shipping_address: client.shipping_address,
    date_of_birth: client.date_of_birth,
    phone_number: client.phone_number,
    email: client.email,
  };
  const addRes = await clientsCollectionRef.add(newClient);
  return addRes?.id ? newClient : undefined;
}

export const updateClient = async (project: Project, id: StoreClient['id'], client: Partial<Omit<StoreClient, 'id' | 'created_at'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(StoreCollections.Clients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set(client, { merge: true });
  return !!setRes;
}

export const getOrdersCount = async (project: Project, filter?: {path: keyof StoreOrder, value: string | number}): Promise<number | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const ordersCollectionRef = getFirestore(app).collection(StoreCollections.Orders);
  let cursor;
  if (filter && (filter.value && filter.value !== 'all')) {
    cursor = ordersCollectionRef.where(filter.path, '==', filter.value);
  }
  const countQuery = await (cursor ?? ordersCollectionRef).count().get();
  return countQuery.data().count;
}

export const getOrders = async (project: Project, limit: number, startAfter?: number | string | Document, filter?: {path: keyof StoreOrder, value: string | number}): Promise<StoreOrder[]> => {
  const orders: StoreOrder[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return orders };
  const ordersCollectionRef = getFirestore(app).collection(StoreCollections.Orders);
  let cursor;
  if (filter && (filter.value && filter.value !== 'all')) {
    cursor = ordersCollectionRef.where(filter.path, '==', filter.value);
  }
  cursor = (cursor ?? ordersCollectionRef).orderBy('created_at', 'desc');
  if (startAfter !== undefined && (typeof startAfter === 'number' && startAfter > -1)) {
    cursor = cursor.startAfter(startAfter);
  }
  const ordersRes = await cursor.limit(limit).get();
  if (!ordersRes || ordersRes.empty) {
    return orders;
  }
  orders.push(...ordersRes.docs.map(doc => doc.data() as StoreOrder))
   return orders;
}

export const deleteOrder = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const ordersCollectionRef = getFirestore(app).collection(StoreCollections.Orders);
  const ordersRes = await ordersCollectionRef.where('id', '==', id).get();
  const ordersDoc = ordersRes?.docs?.pop();
  if (!ordersDoc?.exists) { return false; };
  const deleteRes = await ordersDoc.ref.delete();
  return !!deleteRes;
}

export const createOrder = async (project: Project, order: Pick<StoreOrder, 'client_id' | 'items' | 'total_price' | 'additional_discount' | 'shipping_option' | 'status'>): Promise<StoreOrder | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const ordersCollectionRef = getFirestore(app).collection(StoreCollections.Orders);
  const newOrder: StoreOrder = {
    id: uuidv4(),
    created_at: new Date().getTime(),
    client_id: order.client_id,
    items: order.items,
    total_price: order.total_price,
    additional_discount: order.additional_discount,
    shipping_option: order.shipping_option,
    status: order.status,
    serial_number: await getNextOrderSerialNumber<StoreOrder>(ordersCollectionRef),
  };
  const addRes = await ordersCollectionRef.add(newOrder);
  return addRes?.id ? newOrder : undefined;
}

export const getNextOrderSerialNumber = async <T extends { serial_number: number }>(ordersCollectionRef: CollectionReference<T>): Promise<number> => {
  const highest = (await ordersCollectionRef.orderBy('serial_number', 'desc').limit(1).get())?.docs?.pop()?.data()?.serial_number;
  if (!highest) {
    return 1;
  } 
  return highest + 1;
}

export const updateOrder = async (project: Project, id: StoreOrder['id'], order: Partial<Omit<StoreOrder, 'id' | 'created_at'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(StoreCollections.Orders).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set(order, { merge: true });
  return !!setRes;
}

export const getOrder = async (project: Project, serial_number: StoreOrder['serial_number']): Promise<StoreOrder | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return; };
  const query = await getFirestore(app).collection(StoreCollections.Orders).where('serial_number', '==', serial_number).get();
  if (query.empty) {
    return;
  }
  return query.docs.pop()?.data() as StoreOrder;
}

export const getProductsCount = async (project: Project, filter?: {path: keyof StoreProduct, value: string | number}): Promise<number | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const productsCollectionRef = getFirestore(app).collection(StoreCollections.Products);
  let cursor;
  if (filter && (filter.value && filter.value !== 'all')) {
    cursor = productsCollectionRef.where(filter.path, '==', filter.value);
  }
  const countQuery = await (cursor ?? productsCollectionRef).count().get();
  return countQuery.data().count;
}

export const getProducts = async (project: Project, limit: number, startAfter?: number | string | Document, filter?: {path: keyof StoreProduct, value: string | number}): Promise<StoreProduct[]> => {
  const products: StoreProduct[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return products };
  const productsCollectionRef = getFirestore(app).collection(StoreCollections.Products);
  let cursor;
  if (filter && (filter.value && filter.value !== 'all')) {
    cursor = productsCollectionRef.where(filter.path, '==', filter.value);
  }
  cursor = (cursor ?? productsCollectionRef).orderBy('created_at', 'desc');
  if (startAfter !== undefined && (typeof startAfter === 'number' && startAfter > -1)) {
    cursor = cursor.startAfter(startAfter);
  }
  const ordersRes = await cursor.limit(limit).get();
  if (!ordersRes || ordersRes.empty) {
    return products;
  }
  products.push(...ordersRes.docs.map(doc => doc.data() as StoreProduct))
  return products;
}

export const deleteProduct = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const productssCollectionRef = getFirestore(app).collection(StoreCollections.Products);
  const productsRes = await productssCollectionRef.where('id', '==', id).get();
  const productsDoc = productsRes?.docs?.pop();
  if (!productsDoc?.exists) { return false; };
  const deleteRes = await productsDoc.ref.delete();
  return !!deleteRes;
}

export const uploadProductImage = async (project: Project, id: string, image: File): Promise<Image | undefined> => {
  let uploadedImage: Image | undefined = {path: '', url: ''};
  const app = getSecondaryApp(project);
  if (!app) { return uploadedImage };
  const bucket = getStorage(app).bucket();
  const buffer = Buffer.from(await image.arrayBuffer());
  try {
    uploadedImage.path = `${StoreStorageDirectories.Products}/${id}`;
    const fileRef = bucket.file(uploadedImage.path);
    await fileRef.save(buffer);
    uploadedImage.url = await getDownloadURL(fileRef);
  } catch {
    uploadedImage = undefined;
  }
  return uploadedImage;
}

export const deleteProductImage = async (project: Project, id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const bucket = getStorage(app).bucket();
  const fileRef = bucket.file(`${StoreStorageDirectories.Products}/${id}`);
  const deleteRes = await fileRef.delete();
  return !!deleteRes?.at(0);
}


export const getProduct = async (project: Project, serial_number: StoreProduct['serial_number']): Promise<StoreProduct | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return; };
  const query = await getFirestore(app).collection(StoreCollections.Products).where('serial_number', '==', serial_number).get();
  if (query.empty) {
    return;
  }
  return query.docs.pop()?.data() as StoreProduct;
}

export const createProduct = async (project: Project, product: Pick<StoreProduct, 'name' | 'description' | 'color' | 'discount' | 'size' | 'stock'>): Promise<StoreProduct | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const productsCollectionRef = getFirestore(app).collection(StoreCollections.Products);
  const newProduct: StoreProduct = {
    id: uuidv4(),
    created_at: new Date().getTime(),
    serial_number: await getNextOrderSerialNumber<StoreProduct>(productsCollectionRef),
    name: product.name,
    description: product.description,
    color: product.color,
    discount: product.discount,
    size: product.size,
    stock: product.stock,
  };
  const addRes = await productsCollectionRef.add(newProduct);
  return addRes?.id ? newProduct : undefined;
}

export const updateProduct = async (project: Project, id: StoreProduct['id'], order: Partial<Omit<StoreProduct, 'id' | 'created_at' | 'serial_number'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(StoreCollections.Products).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set(order, { merge: true });
  return !!setRes;
}
