import { z } from "zod";


const categorySchema = z.object({
  title: z.string().min(3),
  display_location: z.number({coerce: true}).default(1),
  discount: z.number({coerce: true}).optional(),
  imageFile: z
  .any()
  .optional(),
  id: z.string().optional(),
});

export const formSchema = categorySchema
  .extend({
    children: z.array(categorySchema).optional(),
  });

 
export type FormSchema = typeof formSchema;