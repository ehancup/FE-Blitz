import { BaseResponsePagination } from "../axios/axiosClient";

export interface Product {
  id: string;
  name: string;
  description: string;
  store: {
    id: string;
    name: string;
  }
  categoryToProduct: Category[];
  type: "pre_order" | "ready_stok";
  price: number;
  stock: number;
  image?: ProductImage[];
  category?: ProductCategory[];
  etalase: {
    id: string;
    name: string;
  };
}

interface ProductImage {
  id?: string;
  image: string;
}

interface ProductCategory {
  id: string;
}

interface Category {
  category: {
    id: string;
    name: string;
  };
}

export interface ProductResponse extends BaseResponsePagination {
  data: Product[];
}

export interface ProductRandomResponse {
  data: Product[]
}

export interface CreateProductPayload
  extends Pick<
    Product,
    "name" | "description" | "price" | "type" | "stock" | "image"
  > {
  etalase_id: string;
  category: {
    id: string;
  }[];
}

export interface UpdateProductPayload
  extends Pick<Product, "name" | "description" | "price" | "type" | "stock"> {
  etalase_id: string;
}

interface DetailCategory {
  category: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

interface DetailImage {
  id: string;
  image: string;
}

export interface ProductDetailResponse {
  data: {
    id: string;
    name: string;
    description: string;
    etalase_id: string;
    categoryToProduct: DetailCategory[];
    image: DetailImage[];
    type: "pre_order" | "ready_stok";
    price: number;
    stock: number;
    created_at: string;
    store: {
      id: string;
      name: string;
      route: string;
      avatar: string;
      location: string;
    };
    etalase: {
      id: string;
      name: string;
      avatar: string;
    };
    _count : {
      image: number;
      orderDetail: number
    }
  };
}

interface UploadMultiResponse {
  data: {
    file: {
      file_url: string;
      file_name: string;
      file_size: number;
    }[];
  };
}

export interface DeleteProductBulkPayload {
  data: string[]
}