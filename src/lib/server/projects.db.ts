import { getFirestore } from "firebase-admin/firestore";
import { uuidv4 } from '@firebase/util';
import { Collections } from "$lib/enums/collections";
import { app } from "./admin";
import type { Project } from "$lib/models/project";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import type { Image } from '$lib/models/image';

export const createProject = async (project: Pick<Project, 'name' | 'url' | 'type' | 'logo'>): Promise<Project | undefined> => {
  try {
    const db = getFirestore(app());
    const projectsRef = db.collection(Collections.Projects);
    const newProject: Project = {
      id: uuidv4(),
      name: project.name,
      url: project.url,
      created_at: new Date().getTime(),
      type: project.type,
      logo: project.logo,
    }
    const res = await projectsRef.add(newProject);
    return res?.id ? newProject : undefined;
  } catch {
    return;
  }
}

export const getProjects = async (names?: string[]): Promise<Project[] | null> => {
  try {
    const db = getFirestore(app());
    const projectsRef = db.collection(Collections.Projects);
    let projects;
    if (names) {
      projects = await projectsRef.where('name', 'in', names).get();
    } else {
      projects = await projectsRef.get();
    }
    return projects?.docs?.map(doc => doc.data() as Project) || null;
  } catch {
    return null;
  }
}

export const getProject = async (id: Project['id']): Promise<Project | null> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Projects).where('id', '==', id).get();
    if (query.empty) {
      return null;
    }
    return query.docs[0].data() as Project;
  } catch {
    return null;
  }
}


export const deleteProject = async (id: Project['id']): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Projects).where('id', '==', id).get();
    if (query.empty) {
      return false;
    }
    const deleteRes = await query?.docs[0]?.ref?.delete();
    return !!deleteRes;
  } catch {
    return false;
  }
}


export const updateProject = async (id: Project['id'], data: Partial<Pick<Project, 'url' | 'settings' | 'logo'>> & Record<string, unknown>): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Projects).where('id', '==', id).get();
    if (query.empty) {
      return false;
    }
    const setRes = await query.docs[0].ref.set(data, { merge: true });
    return !!setRes;
  } catch {
    return false;
  }
}

export const uploadFile = async (path: string, file: File): Promise<Image | undefined> => {
  let uploadedFile: Image | undefined = {path, url: '', date: file.lastModified};
  const bucket = getStorage(app()).bucket();
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

export const deleteFileOrDirectory = async (path: string, options?: {isPathDirectory?: boolean}): Promise<boolean> => {
  const bucket = getStorage(app()).bucket();
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