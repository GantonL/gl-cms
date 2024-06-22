import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3),
  email: z.string(),
  home_address: z.string(),
  shipping_address: z.string(),
  phone_number: z.string(),
  date_of_birth: z.string().optional(),
});
 
export type FormSchema = typeof formSchema;