import type { Project } from "$lib/models/project";
import { getFirestore } from "firebase-admin/firestore";
import { getSecondaryApp } from "./secondary.db";
import type { ClinicPatient } from "$lib/models/clinic";
import { ClinicCollections } from "$lib/enums/collections";

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