import type { StoreOrderStatus } from "$lib/models/store";
import { BadgeCheck, CircleOff, Clock, Loader, PackageCheck, type Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export const StoreOrderStatusStyleConfiguration: Record<StoreOrderStatus, {bg: string, fg: string, icon: ComponentType<Icon>}> = {
  'pending_approval': {
    bg: 'bg-amber-500 border-amber-100',
    fg: 'text-amber-100',
    icon: Clock,
  },
  'approved': {
    bg: 'bg-green-500 border-green-100',
    fg: 'text-green-100',
    icon: BadgeCheck,
  },
  'in_progress': {
    bg: 'bg-sky-500 border-sky-100',
    fg: 'text-sky-100',
    icon: Loader,
  },
  'delivered': {
    bg: 'bg-stone-500 border-stone-100',
    fg: 'text-stone-100',
    icon: PackageCheck
  },
  'canceled': {
    bg: 'bg-red-500 border-red-100',
    fg: 'text-red-100',
    icon: CircleOff,
  },
}