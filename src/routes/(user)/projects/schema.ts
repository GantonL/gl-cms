import { ProjectType } from "$lib/enums/projects";
import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string().min(3),
  type: z.string().refine((r) => r === ProjectType.Store || 
                                 r === ProjectType.Website || 
                                 r === ProjectType.Clinic),
  url: z.string().optional(),
});
 
export type FormSchema = typeof formSchema;

export const editFormSchema = z.object({
  display_name: z.string().min(3),
  url: z.string().optional(),

  // for indentification on update
  id: z.string().optional(),
});

export type EditFormSchema = typeof editFormSchema;
