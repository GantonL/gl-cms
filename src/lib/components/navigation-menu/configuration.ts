import type { NavigationLink } from "$lib/models/navigation-link";
import { PanelsTopLeft, Settings } from "lucide-svelte";

export const NavigationItemsConfiguration: NavigationLink[] = [
  { label: 'Overview', icon: PanelsTopLeft, link: '/' },
];

export const MoreNavigationItems: NavigationLink[] = [
  { label: 'Settings', icon: Settings, link: '/settings' },
];
