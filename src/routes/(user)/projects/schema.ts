import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string().min(3),
  url: z.string().optional(),
});
 
export type FormSchema = typeof formSchema;