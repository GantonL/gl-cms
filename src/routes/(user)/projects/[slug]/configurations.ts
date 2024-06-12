import { ProjectType } from "$lib/enums/projects";

interface NavigationTab {
  name: string;
  value: string;
}

const settings: NavigationTab = 
  {
    name: 'Settings',
    value: 'settings',
  };
const storeSettings: NavigationTab = 
  {
    name: 'Settings',
    value: 'store-settings',
  };
const products: NavigationTab = 
  {
    name: 'Products',
    value: 'products',
  };
const categories: NavigationTab = 
  {
    name: 'Categories',
    value: 'categories',
  };
const clients: NavigationTab = 
  {
    name: 'Clients',
    value: 'clients',
  };
const orders: NavigationTab = 
  {
    name: 'Orders',
    value: 'orders',
  };
const contact: NavigationTab = 
  {
    name: 'Contact',
    value: 'contact',
  };

export const ProjectNavigationConfigurations: Record<ProjectType, NavigationTab[]> = {
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