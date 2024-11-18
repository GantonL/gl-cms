import type { ProjectType } from "$lib/enums/projects";
import type { ClinicSettings } from "./clinic";
import type { Image } from "./image";

export interface Project {
  id: string;
  name: string;
  created_at: number;
  type: ProjectType;
  display_name?: string;
  url?: string;
  settings?: {
    [ProjectType.Clinic]?: ClinicSettings;
    [ProjectType.None]?: undefined;
    [ProjectType.Store]?: undefined;
    [ProjectType.Website]?: undefined;
  },
  logo?: Image;
}
