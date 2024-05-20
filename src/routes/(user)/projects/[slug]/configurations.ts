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
const settings: NavigationTab = 
  {
    name: 'Settings',
    value: 'settings',
  };
const content: NavigationTab = 
  {
    name: 'Content',
    value: 'content',
  };

export const ProjectNavigationConfigurations: Record<ProjectType, NavigationTab[]> = {
  [ProjectType.Store]: [
    dashboard,
    content,
    {
      name: 'Store',
      value: 'store'
    },
    settings,
  ],
  [ProjectType.Website]: [
    dashboard,
    content,
    settings,
  ],
}