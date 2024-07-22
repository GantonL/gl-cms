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
  phone_number: string;
  date_of_birth?: string;
}

export type StoreOrderStatus = 'pending_approval' | 'approved' | 'in_progress' | 'delivered' | 'canceled';

export type StoreOrderShippingOption = 'pickup' | 'delivery';

export interface StoreOrderItem {
  product_id: string;
  amount: number;
  price: number;
}

export interface StoreOrder {
  id: string;
  created_at: number;
  client_id: string;
  shipping_option: StoreOrderShippingOption,
  status: StoreOrderStatus;
  total_price: number;
  items: StoreOrderItem[];
  serial_number: number;
  additional_discount?: number;
}

export type StoreProductSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

export interface StoreProduct {
  id: string;
  serial_number: number;
  created_at: number;
  name: string;
  description?: string;
  images?: Image[];
  stock?: number;
  discount?: number;
  color?: string;
  size?: StoreProductSize;
}
