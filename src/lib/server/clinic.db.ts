import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import type { ClinicPatient } from "$lib/models/clinic";
import { ClinicCollections } from "$lib/enums/collections";
import { uuidv4 } from '@firebase/util';

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
    personal_id: patient.personal_id,
    email: patient.email,
    address: patient.address,
    date_of_birth: patient.date_of_birth,
    phone: patient.phone,
    gender: patient.gender,
    refered_by: patient.refered_by,
    notes: patient.notes,
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
  const setRes = await query.docs[0].ref.set(patient, { merge: true });
  return !!setRes;
}
