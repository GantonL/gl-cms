import type { Project } from "$lib/models/project";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import type { ClinicPatient, ClinicTreatmentHistoryItem } from "$lib/models/clinic";
import { ClinicCollections } from "$lib/enums/collections";
import { uuidv4 } from '@firebase/util';
import type { Image } from "$lib/models/image";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { ClinicStorageDirectories } from "$lib/enums/storage";
import { getLocalTimeZone, parseDate } from "@internationalized/date";

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

export const createPatient = async (project: Project, patient: Pick<ClinicPatient, 'address' | 'date_of_birth' | 'email' | 'first_name' | 'gender' | 'notes' | 'personal_id' | 'phone' | 'refered_by' | 'sur_name' | 'medical_condition' | 'medications'>): Promise<ClinicPatient | undefined> => {
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
  const data = patientDoc?.data();
  if (!patientDoc?.exists) { return false; };
  const deleteRes = await patientDoc.ref.delete();
  if (deleteRes) {
    if (data?.files?.length) {
      const deleteFiles = await deleteFileOrDirectory(project, `${ClinicStorageDirectories.Files}/${id}`, { isPathDirectory: true });
      if (!deleteFiles) {
        return false;
      }
    }
    if (data?.images?.length) {
      const deleteFiles = await deleteFileOrDirectory(project, `${ClinicStorageDirectories.PatientsImages}/${id}`, { isPathDirectory: true });
      if (!deleteFiles) {
        return false;
      }
    }
    if (data?.avatar) {
      const deleteAvatar = await deleteFileOrDirectory(project, `${ClinicStorageDirectories.Avatars}/${id}`, { isPathDirectory: true });
      if (!deleteAvatar) {
        return false;
      }
    }
  }
  return !!deleteRes;
}

export const uploadAvatar = async (project: Project, id: string, image: File): Promise<Image | undefined> => {
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

export const uploadFile = async (project: Project, path: string, file: File, date?: string): Promise<Image | undefined> => {
  let formattedDate: number | undefined;
  if (date && date !== 'undefined') {
    formattedDate = parseDate(date).toDate(getLocalTimeZone()).getTime();
  } 
  let uploadedFile: Image | undefined = {path, url: '', date: formattedDate ?? file.lastModified};
  const app = getSecondaryApp(project);
  if (!app) { return uploadedFile };
  const bucket = getStorage(app).bucket();
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const fileRef = bucket.file(uploadedFile.path);
    await fileRef.save(buffer);
    uploadedFile.url = await getDownloadURL(fileRef);
  } catch {
    uploadedFile = undefined;
  }
  return uploadedFile;
}

export const deleteFileOrDirectory = async (project: Project, path: string, options?: {isPathDirectory?: boolean}): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const bucket = getStorage(app).bucket();
  try {
    if (options?.isPathDirectory) {
      await bucket.deleteFiles({prefix: path});
      return true;
    } else {
      const fileRef = bucket.file(path);
      const deleted = await fileRef.delete().catch(() => false );
      return !!deleted;
    }
  } catch {
    return false;
  }
}

export const addPatientFiles = async (project: Project, id: ClinicPatient['id'], files: Image[]): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set({files: FieldValue.arrayUnion(...files)}, { merge: true });
  return !!setRes;
}

export const addPatientImages = async (project: Project, id: ClinicPatient['id'], images: Image[]): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set({images: FieldValue.arrayUnion(...images)}, { merge: true });
  return !!setRes;
}

export const removePatientFiles = async (project: Project, id: ClinicPatient['id'], files: Image[]): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set({files: FieldValue.arrayRemove(...files)}, { merge: true });
  return !!setRes;
}

export const removePatientImages = async (project: Project, id: ClinicPatient['id'], images: Image[]): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.Patients).where('id', '==', id).get();
  if (query.empty) {
    return false;
  }
  const setRes = await query.docs[0].ref.set({images: FieldValue.arrayRemove(...images)}, { merge: true });
  return !!setRes;
}


export const getPatientTreatmentsHistory = async (project: Project, patient_id: ClinicPatient['id']): Promise<ClinicTreatmentHistoryItem[]> => {
  const history: ClinicTreatmentHistoryItem[] = [];
  const app = getSecondaryApp(project);
  if (!app) { return [] };
  const query = await getFirestore(app).collection(ClinicCollections.TreatmentsHistory).where('patient_id', '==', patient_id).get();
  if (query.empty) {
    return [];
  }
  history.push(...query.docs.map(doc => doc.data() as ClinicTreatmentHistoryItem))
  return history;
}

export const createPatientTreatment = async (project: Project, treatment: Pick<ClinicTreatmentHistoryItem, 'date' | 'time' | 'documentation' | 'notes' | 'patient_id' | 'price'>): Promise<ClinicTreatmentHistoryItem | undefined> => {
  const app = getSecondaryApp(project);
  if (!app) { return };
  const treatmentsHistoryCollectionRef = getFirestore(app).collection(ClinicCollections.TreatmentsHistory);
  const newTreatment: ClinicTreatmentHistoryItem = {
    id: uuidv4(),
    date: treatment.date,
    time: treatment.time ?? '',
    patient_id: treatment.patient_id,
    documentation: treatment.documentation ?? '',
    notes: treatment.notes ?? '',
    price: treatment.price ?? 0,
  };
  const addRes = await treatmentsHistoryCollectionRef.add(newTreatment);
  return addRes?.id ? newTreatment : undefined;
}

export const updatePatientTreatment = async (project: Project, patient_id: string, treatment: Pick<ClinicTreatmentHistoryItem, 'date' | 'time' | 'documentation' | 'notes' | 'price'>): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.TreatmentsHistory).where('patient_id', '==', patient_id).get();
  if (query.empty) {
    return false;
  }
  const ref = query.docs[0].ref;
  const setRes = await ref.set(treatment, { merge: true });
  return !!setRes;
}

export const deletePatientTreatment = async (project: Project, patient_id: string, treatment_id: string): Promise<boolean> => {
  const app = getSecondaryApp(project);
  if (!app) { return false };
  const query = await getFirestore(app).collection(ClinicCollections.TreatmentsHistory)
    .where('patient_id', '==', patient_id)
    .where('id', '==', treatment_id).get();
  if (query.empty) {
    return false;
  }
  const treatmentDoc = query?.docs?.pop();
  if (!treatmentDoc?.exists) { return false; };
  const deleteRes = await treatmentDoc.ref.delete();
  return !!deleteRes;
}
