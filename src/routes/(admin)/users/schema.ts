import { UserRole } from "$lib/enums/user-role";
import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string().refine((r) => r === UserRole.Admin || r === UserRole.User)
});
 
export type FormSchema = typeof formSchema;