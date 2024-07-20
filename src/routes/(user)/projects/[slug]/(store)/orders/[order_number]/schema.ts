import type { StoreOrderStatus } from "$lib/models/store";
import { z } from "zod";
const orderStatuses: StoreOrderStatus[] = ['canceled', 'approved', 'delivered', 'in_progress', 'pending_approval'];

export const formSchema = z.object({
  id: z.string().optional(),
  serial_number: z.string().readonly().optional(),
  client_id: z.string(),
  shipping_option: z.string().default('delivery').refine(so => so === 'delivery' || so === 'pickup'),
  status: z.string().default('approved').refine((status) => orderStatuses.includes(status as StoreOrderStatus)),
  additional_discount: z.number({coerce: true, message: 'Must be between 0 to 100'}).optional().refine((discount) => typeof discount === 'number' && (discount >= 0 && discount <= 100)),
});
 
export type FormSchema = typeof formSchema;