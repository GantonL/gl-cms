import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import type { ClinicPatient } from "$lib/models/clinic";
import { ClinicCollections } from "$lib/enums/collections";
import { uuidv4 } from '@firebase/util';
import type { Image } from "$lib/models/image";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { ClinicStorageDirectories } from "$lib/enums/storage";

export const getPatientsCount = async (project: Project, filter?: {path: keyof ClinicPatient, value: string | number}): Promise<number | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const patientsCollectionRef = getFirestore(app).collection(ClinicCollections.Patients);
  let cursor;
  if (filter && (filter.value)) {
      cursor = patientsCollectionRef.where(filter.path, '==', filter.value);
  }
  const countQuery = await (cursor ?? patientsCollectionRef).count().get();
  return countQuery.data().count;
}


export const getPatients = async (project: Project, limit: number, startAfter?: number | string | Document, filter?: {path: keyof ClinicPatient, value: string | number}): Promise<ClinicPatient[]> => {
  const patients: ClinicPatient[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return patients };
  const patientsCollectionRef = getFirestore(app).collection(ClinicCollections.Patients);
  let patientsCursor = patientsCollectionRef.orderBy('created_at', 'desc');
  if (startAfter !== undefined && (typeof startAfter === 'number' && startAfter > -1)) {
    patientsCursor = patientsCursor.startAfter(startAfter);
  }
  if (filter && (filter.value)) {
    patientsCursor = patientsCollectionRef.where(filter.path, '==', filter.value);
  }
  const clientsRes = await patientsCursor.limit(limit).get();
  if (!clientsRes || clientsRes.empty) {
    return patients;
  }
  patients.push(...clientsRes.docs.map(doc => doc.data() as ClinicPatient))
  return patients;
}

export const getPatient = async (project: Project, id: ClinicPatient['id']): Promise<ClinicPatient | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return; };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return;
  }
  const patient = query.docs.pop()?.data() as ClinicPatient;
  return patient;
}

export const createPatient = async (project: Project, patient: Pick<ClinicPatient, 'address' | 'date_of_birth' | 'email' | 'first_name' | 'gender' | 'notes' | 'personal_id' | 'phone' | 'refered_by' | 'sur_name'>): Promise<ClinicPatient | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const patientsCollectionRef = getFirestore(app).collection(ClinicCollections.Patients);
  const newPatient: ClinicPatient = {
    id: uuidv4(),
    created_at: new Date().getTime(),
    first_name: patient.first_name,
    sur_name: patient.sur_name,
    full_name: `${patient.first_name} ${patient.sur_name}`,
    personal_id: patient.personal_id,
    email: patient.email,
    address: patient.address,
    date_of_birth: patient.date_of_birth,
    phone: patient.phone,
    gender: patient.gender,
    refered_by: patient.refered_by ?? '',
    notes: patient.notes ?? '',
  };
  const addRes = await patientsCollectionRef.add(newPatient);
  return addRes?.id ? newPatient : undefined;
}

export const updatePatient = async (project: Project, id: ClinicPatient['id'], patient: Partial<Omit<ClinicPatient, 'id' | 'created_at'>>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const ref = query.docs[0].ref;
  if (patient.first_name || patient.sur_name) {
    const data = (await ref.get()).data();
    patient.full_name = `${patient.first_name ?? data?.first_name} ${patient.sur_name ?? data?.sur_name}`;
  }
  const setRes = await ref.set(patient, { merge: true });
  return !!setRes;
}

export const deletePatient = async (project: Project, id: ClinicPatient['id']): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const patientsCollectionRef = getFirestore(app).collection(ClinicCollections.Patients);
  const patientRes = await patientsCollectionRef.where('id', '==', id).get();
  const patientDoc = patientRes?.docs?.pop();
  if (!patientDoc?.exists) { return false; };
  const deleteRes = await patientDoc.ref.delete();
  return !!deleteRes;
}

export const uploadImage = async (project: Project, id: string, image: File): Promise<Image | undefined> => {
  let uploadedImage: Image | undefined = {path: '', url: ''};
  const app = getSecondaryApp(project);
  if (!app) { return uploadedImage };
  const bucket = getStorage(app).bucket();
  const buffer = Buffer.from(await image.arrayBuffer());
  try {
    uploadedImage.path = `${ClinicStorageDirectories.Avatars}/${id}`;
    const fileRef = bucket.file(uploadedImage.path);
    await fileRef.save(buffer);
    uploadedImage.url = await getDownloadURL(fileRef);
  } catch {
    uploadedImage = undefined;
  }
  return uploadedImage;
}

