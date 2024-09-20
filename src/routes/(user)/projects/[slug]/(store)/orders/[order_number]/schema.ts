import { CurrencyType } from "$lib/enums/currency";
import type { PaymentStatus } from "$lib/models/payment";
import type { StoreOrderStatus } from "$lib/models/store";
import { z } from "zod";
const orderStatuses: StoreOrderStatus[] = ['canceled', 'approved', 'delivered', 'in_progress', 'pending_approval'];
const paymentStatuses: PaymentStatus[] = ['awaiting', 'in_process', 'partial', 'received'];

export const formSchema = z.object({
  // Added upon changes from non-form origin
  id: z.string().optional(),
  serial_number: z.string().readonly().optional(),
  total_price: z.number(),
  items: z.array(z.object({
    product_id: z.string(),
    amount: z.number(),
  })),

  // Form native values (inserted directly to form by user)
  client_id: z.string(),
  shipping_option: z.string().default('delivery').refine(so => so === 'delivery' || so === 'pickup'),
  status: z.string().default('approved').refine((status) => orderStatuses.includes(status as StoreOrderStatus)),
  currency: z.string().default(CurrencyType.ILS).refine((currency) => Object.keys(CurrencyType).includes(currency)),
  payment_status: z.string().default('awaiting').refine((ps) => paymentStatuses.includes(ps as PaymentStatus)),
  additional_discount: z.number({coerce: true, message: 'Must be between 0 to 100'}).optional().refine((discount) => typeof discount === 'number' && (discount >= 0 && discount <= 100)),
});
 
export type FormSchema = typeof formSchema;