import { getFirestore } from "firebase-admin/firestore";
import { uuidv4 } from '@firebase/util';
import { Collections } from "$lib/enums/collections";
import type { User } from "$lib/models/user";
import { app } from "./admin";

export const createUser = async (user: Pick<User, 'email' | 'name' | 'role'>): Promise<User | undefined> => {
  try {
    const db = getFirestore(app());
    const usersRef = db.collection(Collections.Users);
    const newUser: User = {
      id: uuidv4(),
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: new Date().getTime(),
    }
    const res = await usersRef.add(newUser);
    return res?.id ? newUser : undefined;
  } catch {
    return;
  }
}

export const getUsers = async (): Promise<User[] | null> => {
  try {
    const db = getFirestore(app());
    const usersRef = db.collection(Collections.Users);
    const users = (await usersRef.get()).docs.map(doc => doc.data() as User);
    return users;
  } catch {
    return null;
  }
}

export const getUser = async (email: User['email']): Promise<User | null> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Users).where('email', '==', email).get();
    if (query.empty) {
      return null;
    }
    return query.docs[0].data() as User;
  } catch {
    return null;
  }
}

export const updateUser = async (id: string, data: Partial<Pick<User, 'image' | 'role'>>): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Users).where('id', '==', id).get();
    if (query.empty) {
      return false;
    }
    const setRes = await query.docs[0].ref.set(data, { merge: true });
    return !!setRes;
  } catch {
    return false;
  }
}

export const deleteUser = async (id: User['id']): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const query = await db.collection(Collections.Users).where('id', '==', id).get();
    if (query.empty) {
      return false;
    }
    const deleteRes = await query?.docs[0]?.ref?.delete();
    return !!deleteRes;
  } catch {
    return false;
  }
}