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

export interface StoreContact {
  id: string;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  embeded_map_url?: string;
  navigation_url?: string;
}
