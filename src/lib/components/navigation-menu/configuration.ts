import type { NavigationLink } from "$lib/models/navigation-link";
import { UserRole } from "$lib/enums/user-role";
import { Barcode, ContactRound, Grid2X2, HandMetal, Phone, Settings, ShoppingCart, SquareUser, Users } from "lucide-svelte";
import { ProjectType } from "$lib/enums/projects";

const sharedItemsConfiguration: NavigationLink[] = [
  { 
    label: 'Projects', 
    icon: HandMetal, 
    path: 'projects',
    link: ''
  }, 
];

const AdminItemsConfiguration: NavigationLink[] = [
  { 
    label: 'Users', 
    icon: Users, 
    path: 'users',
    link: ''
  }, 
  ...sharedItemsConfiguration,
];

const NavigationItemsConfiguration: NavigationLink[] = [
  ...sharedItemsConfiguration,
];


const settings: NavigationLink = 
  {
    label: 'Settings',
    path: 'settings',
    link: '',
    icon: Settings,
  };
const storeSettings: NavigationLink = 
  {
    label: 'Settings',
    path: 'store-settings',
    link: '',
    icon: Settings,
  };
const products: NavigationLink = 
  {
    label: 'Products',
    path: 'products',
    link: '',
    icon: Barcode
  };
const categories: NavigationLink = 
  {
    label: 'Categories',
    path: 'categories',
    link: '',
    icon: Grid2X2
  };
const clients: NavigationLink = 
  {
    label: 'Clients',
    path: 'clients',
    link: '',
    icon: SquareUser
  };
const orders: NavigationLink = 
  {
    label: 'Orders',
    path: 'orders',
    link: '',
    icon: ShoppingCart
  };
const contact: NavigationLink = 
  {
    label: 'Contact',
    path: 'contact',
    link: '',
    icon: Phone
  };
const patients: NavigationLink = 
{
  label: 'Patients',
  path: 'patients',
  link: '',
  icon: ContactRound
}
const clinicSettings: NavigationLink = 
{
  label: 'Settings',
  path: 'clinic-settings',
  link: '',
  icon: Settings,
};

export const ItemsConfiguration: Record<UserRole, NavigationLink[]> = {
  [UserRole.Admin]: AdminItemsConfiguration,
  [UserRole.User]: NavigationItemsConfiguration,
}

export const projectItemsConfiguration: Record<ProjectType, NavigationLink[]> = {
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
  [ProjectType.Clinic]: [
    patients,
    clinicSettings,
  ],
}

export const MoreNavigationItems: NavigationLink[] = [
  // extra navigation items to add
];
