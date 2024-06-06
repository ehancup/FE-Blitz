import { BaseResponsePagination } from "../axios/axiosClient";
import { Product } from "../product/interface";

export interface WishlistResponse extends BaseResponsePagination {
    data: {
        id: string;
        product: Product
    } []
}