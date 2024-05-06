import type { FirebaseOptions } from "firebase/app";

export interface Project {
  id: string;
  name: string;
  created_at: number;
  url?: string;
  credentails?: FirebaseOptions;
}
