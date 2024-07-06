import type { StoreOrderStatus } from "$lib/models/store";

export const StoreOrderStatusStyleConfiguration: Record<StoreOrderStatus, {bg: string, fg: string}> = {
  'pending_approval': {
    bg: '',
    fg: '',
  },
  'approved': {
    bg: '',
    fg: '',
  },
  'in_progress': {
    bg: '',
    fg: '',
  },
  'delivered': {
    bg: '',
    fg: '',
  },
  'aborted': {
    bg: '',
    fg: '',
  },
}