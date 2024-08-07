import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface NavigationLink {
  label: string;
  path: string;
  link: string;
  icon?: ComponentType<Icon>;
}
