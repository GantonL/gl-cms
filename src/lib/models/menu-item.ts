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

export interface ActionItem<T> {
  group?: ActionItem<T>[];
  label?: string;
  icon?: ComponentType<Icon>;
  event?: string;
  class?: string;
  link?: string;
}

export interface ActionMenuConfiguration<T> {
  items: ActionItem<T>[];
  trigger: {
    label: string;
    labelClass?: string;
    icon?: ComponentType<Icon>;
    iconClass?: string;
  };
  data?: T;
}
