import { z } from "zod";


const categorySchema = z.object({
  title: z.string().min(3),
  display_location: z.number().default(1),
  discount: z.number().optional(),
  imageFile: z
  .any()
  .optional()
});

export const formSchema = categorySchema
  .extend({
    children: z.array(categorySchema).optional(),
  });

 
export type FormSchema = typeof formSchema;