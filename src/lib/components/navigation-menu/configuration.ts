import type { NavigationLink } from "$lib/models/navigation-link";
import { UserRole } from "$lib/enums/user-role";
import { HandMetal, PanelsTopLeft, Settings, Users } from "lucide-svelte";

const AdminItemsConfiguration: NavigationLink[] = [
  { label: 'Users', icon: Users, link: '/users' }, 
  { label: 'Projects', icon: HandMetal, link: '/projects' }, 
];

const NavigationItemsConfiguration: NavigationLink[] = [
  { label: 'Overview', icon: PanelsTopLeft, link: '/' },
];

export const ItemsConfiguration: Record<UserRole, NavigationLink[]> = {
  [UserRole.Admin]: AdminItemsConfiguration,
  [UserRole.User]: NavigationItemsConfiguration,
}

export const MoreNavigationItems: NavigationLink[] = [
  { label: 'Settings', icon: Settings, link: '/settings' },
];
