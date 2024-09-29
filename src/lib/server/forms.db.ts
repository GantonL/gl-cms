import { getFirestore } from "firebase-admin/firestore";
import { Collections } from "$lib/enums/collections";
import { app } from "./admin";
import type { FormTemplate } from "$lib/models/form-template";
import { uuidv4 } from '@firebase/util';

export const getFormsTemplates = async (project_id: string): Promise<FormTemplate[]> => {
  try {
    const db = getFirestore(app());
    const formsRef = db.collection(Collections.Forms);
    const templates = await formsRef.where('project', '==', project_id).get();
    return templates?.docs?.map(d => d.data()) as FormTemplate[] ?? [];
  } catch {
    return [];
  }
}

export const deleteFormTemplate = async (id: string): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Forms).where('id', '==', id).get();
    if (query.empty) {
      return false;
    }
    const deleteRes = await query?.docs[0]?.ref?.delete();
    return !!deleteRes;
  } catch {
    return false;
  }
}

export const createFormTemplate = async (project_id: string, form: Pick<FormTemplate, 'type'>): Promise<FormTemplate | undefined> => {
  try {
    const db = getFirestore(app());
    const formsRef = db.collection(Collections.Forms);
    const newTemplate: FormTemplate = {
      id: uuidv4(),
      project: project_id,
      type: form.type,
    }
    const res = await formsRef.add(newTemplate);
    return res?.id ? newTemplate : undefined;
  } catch {
    return undefined;
  }
}

