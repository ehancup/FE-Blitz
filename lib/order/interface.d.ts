// import { Profile } from "next-auth";
import { Address } from "../address/interface";
import { Profile } from "../auth/interface";
import { Product } from "../product/interface";

export interface SingleOrderPayload {
  product_id: string;
  address_id: string;
  quantity: number;
}

export interface OrderPayload {
  data: string[];
  address: string;
}

export interface OrderDetailResponse {
  id: string;
  product_id;
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
  product: Product;
}

export interface Order {
  id: string;
  invoice: string;
  store_name: string;
  total_quantity: number;
  total_amount: number;
  ship_status:
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller";
  created_at: string;
  updated_at: string;
  orderDetail: OrderDetailResponse[]
}

export interface DetailOrder extends Order {
  address: Address;
  buyer: Profile;
} 

export interface DetailOrderResponse {
  data: DetailOrder
}

export interface OrderUserResponse {
    data: Order[]
}

export interface OrderSellerResponse extends OrderUserResponse {

}

export interface UpdateStatusPayload {
  status: | "wait"
  | "process"
  | "shipping"
  | "error"
  | "done"
  | "cancel_user"
  | "cancel_seller";
}
