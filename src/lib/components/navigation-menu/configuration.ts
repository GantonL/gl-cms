import type { NavigationLink } from "$lib/models/navigation-link";
import { UserRole } from "$lib/enums/user-role";
import { Barcode, ContactRound, FileSignature, Grid2X2, HandMetal, Phone, Settings, ShoppingCart, SquareUser, Users } from "lucide-svelte";
import { ProjectType } from "$lib/enums/projects";

const sharedItemsConfiguration: NavigationLink[] = [
  { 
    label: 'common.projects', 
    icon: HandMetal, 
    path: 'projects',
    link: ''
  }, 
];

const AdminItemsConfiguration: NavigationLink[] = [
  { 
    label: 'common.users', 
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
    label: 'common.settings',
    path: 'settings',
    link: '',
    icon: Settings,
  };
const storeSettings: NavigationLink = 
  {
    label: 'common.settings',
    path: 'store-settings',
    link: '',
    icon: Settings,
  };
const products: NavigationLink = 
  {
    label: 'common.products',
    path: 'products',
    link: '',
    icon: Barcode
  };
const categories: NavigationLink = 
  {
    label: 'common.categories',
    path: 'categories',
    link: '',
    icon: Grid2X2
  };
const clients: NavigationLink = 
  {
    label: 'common.clients',
    path: 'clients',
    link: '',
    icon: SquareUser
  };
const orders: NavigationLink = 
  {
    label: 'common.orders',
    path: 'orders',
    link: '',
    icon: ShoppingCart
  };
const contact: NavigationLink = 
  {
    label: 'common.contact',
    path: 'contact',
    link: '',
    icon: Phone
  };
const patients: NavigationLink = 
{
  label: 'common.patients',
  path: 'patients',
  link: '',
  icon: ContactRound
}
const clinicSettings: NavigationLink = 
{
  label: 'common.settings',
  path: 'clinic-settings',
  link: '',
  icon: Settings,
};

const clinicForms: NavigationLink = 
{
  label: 'common.forms',
  path: 'clinic-forms',
  link: '',
  icon: FileSignature,
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
    clinicForms,
    clinicSettings,
  ],
}

