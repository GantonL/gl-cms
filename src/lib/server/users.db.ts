import { getFirestore } from "firebase-admin/firestore";
import { uuidv4 } from '@firebase/util';
import { Collections } from "$lib/enums/collections";
import type { User } from "$lib/types/user";
import { app } from "./admin";

export const createUser = async (user: Pick<User, 'email' | 'name' | 'role'>): Promise<boolean> => {
  try {
    const db = getFirestore(app());
    const usersRef = db.collection(Collections.Users);
    const res = await usersRef.add({
      id: uuidv4(),
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: new Date().getTime(),
    });
    return !!res?.id;
  } catch {
    return false;
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