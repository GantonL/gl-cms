import type { UserRole } from "../enums/user-role";
import type { Project } from "./project";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: number;
  image?: string;
  projects?: Project['name'][];
}
