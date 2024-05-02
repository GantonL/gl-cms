import { getFirestore } from "firebase-admin/firestore";
import { uuidv4 } from '@firebase/util';
import { Collections } from "$lib/enums/collections";
import { app } from "./admin";
import type { Project } from "$lib/models/project";

export const createProject = async (user: Pick<Project, 'name'>): Promise<Project | undefined> => {
  try {
    const db = getFirestore(app());
    const projectsRef = db.collection(Collections.Projects);
    const newProject: Project = {
      id: uuidv4(),
      name: user.name,
      created_at: new Date().getTime(),
    }
    const res = await projectsRef.add(newProject);
    return res?.id ? newProject : undefined;
  } catch {
    return;
  }
}

export const getProjects = async (): Promise<Project[] | null> => {
  try {
    const db = getFirestore(app());
    const projectsRef = db.collection(Collections.Projects);
    const projects = (await projectsRef.get()).docs.map(doc => doc.data() as Project);
    return projects;
  } catch {
    return null;
  }
}

export const getProject = async (id: Project['id']): Promise<Project | null> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Projects).where('email', '==', id).get();
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