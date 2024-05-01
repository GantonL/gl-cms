import type { UserRole } from "../enums/user-role";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: number;
  image?: string;
}
