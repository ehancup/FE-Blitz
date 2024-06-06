import { BaseResponsePagination } from "../axios/axiosClient";

export interface Store {
    id: string;
    name: string;
    route: string;
    avatar: string;
    description: string;
    location: string;
    created_at: string;
    updated_at: string;
}

export interface StoreResponse extends BaseResponsePagination {
    data: Store[]
}

export interface StoreDetailResponse {
    data: Store
}

export interface CreateStorePayload extends Omit<Store, 'id'| 'avatar'| 'created_at'| 'updated_at'> {}

