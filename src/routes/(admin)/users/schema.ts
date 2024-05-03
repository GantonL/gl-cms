import { UserRole } from "$lib/enums/user-role";
import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.string().refine((r) => r === UserRole.Admin || r === UserRole.User),
  projects: z.array(z.string()),
});
 
export type FormSchema = typeof formSchema;