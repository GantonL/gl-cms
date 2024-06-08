import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  address: z.string(),
  embeded_map_url: z.string(),
  navigation_url: z.string(),
});

export type FormSchema = typeof formSchema;
