import type { NavigationLink } from "$lib/models/navigation-link";
import { UserRole } from "$lib/enums/user-role";
import { HandMetal, Users } from "lucide-svelte";

const sharedItemsConfiguration: NavigationLink[] = [
  { label: 'Projects', icon: HandMetal, link: '/projects' }, 
];

const AdminItemsConfiguration: NavigationLink[] = [
  { label: 'Users', icon: Users, link: '/users' }, 
  ...sharedItemsConfiguration,
];

const NavigationItemsConfiguration: NavigationLink[] = [
  ...sharedItemsConfiguration,
];

export const ItemsConfiguration: Record<UserRole, NavigationLink[]> = {
  [UserRole.Admin]: AdminItemsConfiguration,
  [UserRole.User]: NavigationItemsConfiguration,
}

export const MoreNavigationItems: NavigationLink[] = [
  // extra navigation items to add
];
