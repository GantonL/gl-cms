import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface EmptyResultsConfiguration {
  icon: ComponentType<Icon>;
  label: string;
  action?: {
    label: string;
    event: string;
  },
  class?: string;
}

export interface CurrencyItem {
  label: string;
  icon: string; // HTML Entity hex
}