export interface Order {
  id_order: number;
  state_name: string;
  customer_name: string;
  entry_date: string;
  estimated_delivery_date?: string;
}

export interface OrderWithProducts extends Order {
  products?: ProductDetail[];
}

export interface ProductDetail {
  id_product: number;
  name: string;
  category_name: string;
  state_name: string;
  customized: number;
  customized_label: string;
  fabric?: string;
  dimensions?: string;
  description?: string;
  ref_photo?: string;
  order_id: number;
}