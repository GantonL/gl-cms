import type { EmptyResultsConfiguration } from "$lib/models/common";
import { CircleOff } from "lucide-svelte";

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No orders found',
  action: {
    label: 'Create order',
    event: 'create',
  }
}
