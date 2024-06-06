import { BaseResponsePagination } from "../axios/axiosClient";

export interface Address {
  id: string;
  title: string;
  name: string;
  address: string;
  phone_number: string;
  note: string;
}

export interface AddressResponse extends BaseResponsePagination {
  data: Address[];
}

export interface AddressDetailResponse {
  data: Address;
}

export interface CreateAddressPayload extends Omit<Address, "id"> {}
export interface UpdateAddressPayload extends Omit<Address, "id"> {}
