export interface Product {
  id_product: number;
  name: string;
  customized: number;
  ref_photo?: string;
  dimensions?: string;
  fabric?: string;
  description?: string;
  category_name: string;
  order_id: number;
  state_name: string;
  customized_label: string;
}