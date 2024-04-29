import type { NavigationLink } from "$lib/models/navigation-link";
import type { UserRole } from "$lib/types/user-role";
import { PanelsTopLeft, Settings, Users } from "lucide-svelte";

const AdminItemsConfiguration: NavigationLink[] = [
  { label: 'Users', icon: Users, link: '/users' },    
];

const NavigationItemsConfiguration: NavigationLink[] = [
  { label: 'Overview', icon: PanelsTopLeft, link: '/' },
];

export const ItemsConfiguration: Record<UserRole, NavigationLink[]> = {
  admin: AdminItemsConfiguration,
  user: NavigationItemsConfiguration,
}

export const MoreNavigationItems: NavigationLink[] = [
  { label: 'Settings', icon: Settings, link: '/settings' },
];
