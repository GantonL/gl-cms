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