import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface NavigationLink {
  label: string;
  link: string;
  path?: string;
  icon?: ComponentType<Icon>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hide?: (...args: any) => boolean;
}
