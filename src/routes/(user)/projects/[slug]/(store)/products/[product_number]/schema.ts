import { z } from "zod";

export const formSchema = z.object({
  id: z.string().optional(),
  serial_number: z.string().readonly().optional(),
  name: z.string(),
  description: z.string().optional(),
  stock: z.number({coerce: true}).optional(),
  discount: z.number({coerce: true}).optional(),
});
 
export type FormSchema = typeof formSchema;