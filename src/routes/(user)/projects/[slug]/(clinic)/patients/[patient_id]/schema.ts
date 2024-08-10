import { z } from "zod";

export const formSchema = z.object({
  // Added upon changes from non-form origin
  id: z.string().optional(),
  
  // Form native values (inserted directly to form by user)
  first_name: z.string(),
  sur_name: z.string(),
  personal_id: z.string(),
  phone: z.string(),
  email: z.string().email(),
  date_of_birth: z.string(),
  gender: z.string(),
  address: z.string(),
  refered_by: z.string(),
  notes: z.string(),
});
 
export type FormSchema = typeof formSchema;