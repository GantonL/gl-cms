import { ProjectType } from "$lib/enums/projects";

interface NavigationTab {
  name: string;
  value: string;
}

const dashboard: NavigationTab = 
  {
    name: 'Dashboard',
    value: 'dashboard',
  };
const storeDashboard: NavigationTab = 
  {
    name: 'Dashboard',
    value: 'store-dashboard',
  };
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

export const ProjectNavigationConfigurations: Record<ProjectType, NavigationTab[]> = {
  [ProjectType.Store]: [
    storeDashboard,
    orders,
    clients,
    products,
    categories,
    storeSettings,
  ],
  [ProjectType.Website]: [
    dashboard,
    settings,
  ],
}