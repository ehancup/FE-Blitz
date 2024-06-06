import { Product } from "../product/interface";

export interface CreateCartDto {
  quantity: number;
}

export interface UpdateQtyPayload extends CreateCartDto {}

interface Store {
  id: string;
  name: string;
}

export interface Cart {
  id: string;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  data: Cart[];
}

export interface GroupedByStoreItem {
  store: Store;
  items: Cart[];
}

export interface CartAmountResponse {
  data: number
}

export interface CartAmountPayload {
  id: string[]
}