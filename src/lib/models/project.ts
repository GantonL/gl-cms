export interface Project {
  id: string;
  name: string;
  created_at: number;
  url?: string;
  credentails?: Record<string, string>
}