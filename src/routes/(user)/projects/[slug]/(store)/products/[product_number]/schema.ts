import type { StoreProductSize } from "$lib/models/store";
import { z } from "zod";

const optionalSizes: StoreProductSize[] = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];

export const formSchema = z.object({
  id: z.string().optional(),
  serial_number: z.string().readonly().optional(),
  name: z.string(),
  description: z.string().optional(),
  stock: z.number().optional(),
  discount: z.number().optional(),
  color: z.string().optional(),
  size: z.string().optional().refine((size) => optionalSizes.includes(size as StoreProductSize)),
});
 
export type FormSchema = typeof formSchema;