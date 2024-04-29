import type { Auth } from "firebase/auth";
import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface UserMenuItem {
  group?: UserMenuItem[];
  label?: string;
  icon?: ComponentType<Icon>;
  link?: string;
  onClick?: (auth: Auth) => void;
}
