import type { ProjectType } from "$lib/enums/projects";

export interface Project {
  id: string;
  name: string;
  created_at: number;
  type: ProjectType;
  url?: string;
}
