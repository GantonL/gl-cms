import type { ProjectType } from "$lib/enums/projects";
import type { ClinicSettings } from "./clinic";

export interface Project {
  id: string;
  name: string;
  created_at: number;
  type: ProjectType;
  display_name?: string;
  url?: string;
  settings?: {
    clinic?: ClinicSettings;
  }
}
