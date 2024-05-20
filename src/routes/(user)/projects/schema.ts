import { ProjectType } from "$lib/enums/projects";
import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string().min(3),
  type: z.string().refine((r) => r === ProjectType.Store || 
                                 r === ProjectType.Website),
  url: z.string().optional(),
});
 
export type FormSchema = typeof formSchema;