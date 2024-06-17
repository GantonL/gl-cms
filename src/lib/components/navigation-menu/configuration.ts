import type { NavigationLink } from "$lib/models/navigation-link";
import { UserRole } from "$lib/enums/user-role";
import { Barcode, Grid2X2, HandMetal, Phone, Settings, ShoppingCart, SquareUser, Users } from "lucide-svelte";
import { ProjectType } from "$lib/enums/projects";

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


const settings: NavigationLink = 
  {
    label: 'Settings',
    link: 'settings',
    icon: Settings,
  };
const storeSettings: NavigationLink = 
  {
    label: 'Settings',
    link: 'store-settings',
    icon: Settings,
  };
const products: NavigationLink = 
  {
    label: 'Products',
    link: 'products',
    icon: Barcode
  };
const categories: NavigationLink = 
  {
    label: 'Categories',
    link: 'categories',
    icon: Grid2X2
  };
const clients: NavigationLink = 
  {
    label: 'Clients',
    link: 'clients',
    icon: SquareUser
  };
const orders: NavigationLink = 
  {
    label: 'Orders',
    link: 'orders',
    icon: ShoppingCart
  };
const contact: NavigationLink = 
  {
    label: 'Contact',
    link: 'contact',
    icon: Phone
  };

export const ItemsConfiguration: Record<UserRole, NavigationLink[]> = {
  [UserRole.Admin]: AdminItemsConfiguration,
  [UserRole.User]: NavigationItemsConfiguration,
}

export const projectItemsConfiguraion: Record<ProjectType, NavigationLink[]> = {
  [ProjectType.None]: [],
  [ProjectType.Store]: [
    orders,
    clients,
    products,
    categories,
    contact,
    storeSettings,
  ],
  [ProjectType.Website]: [
    contact,
    settings,
  ],
}

export const MoreNavigationItems: NavigationLink[] = [
  // extra navigation items to add
];
