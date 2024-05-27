import type { Image } from "./image";

export interface StoreSettings {
  id: string;
  active: boolean;
  global_discount: number;
  banner: string;
}

export interface StoreCategory {
  id: string;
  title: string;
  created_at: number;
  display_location: number;
  discount?: number;
  image?: Image;
  children?: StoreCategory[];
}
