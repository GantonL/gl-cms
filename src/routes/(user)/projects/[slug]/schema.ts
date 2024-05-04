import { z } from "zod";
 
export const credentialsFormSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  measurementId: z.string().min(1),
});
 
export type CredentialsFormSchema = typeof credentialsFormSchema;