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

export interface StoreClient {
  id: string;
  name: string;
  home_address: string;
  shipping_address: string;
  created_at: number;
  email: string;
}

export type StoreOrderStatus = 'pending_approval' | 'approved' | 'in_progress' | 'delivered';

export interface StoreOrderItem {
  product_id: string;
  amount: number;
  price: number;
}

export interface StoreOrder {
  id: string;
  created_at: number;
  client_id: string;
  shipping_option: 'delivery' | 'pickup',
  status: StoreOrderStatus;
  total_price: number;
  items: StoreOrderItem[];
  additional_discount?: number;
}