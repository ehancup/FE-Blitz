import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axios/axiosClient";
import {
  CreateProductPayload,
  ProductDetailResponse,
  ProductRandomResponse,
  ProductResponse,
  UpdateProductPayload,
} from "./interface";
import { ChangeEvent, useState } from "react";
import useAxiosAuth from "../hook/useAxiosAuth";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const defaultFilter: FilterPage = {
  keyword: "",
  category: "",
  store: "",
  type: "",
  from_price: "",
  to_price: "",
  etalase_id: "",
  page: 1,
  pageSize: 20,
};

interface FilterPage {
  keyword: string;
  category: string;
  store: string;
  type: "pre_order" | "ready_stok" | "";
  from_price: number | undefined | string;
  to_price: number | undefined | string;
  etalase_id: string;
  page: number;
  pageSize: number;
}

const useProductModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const getStoreProduct = async (
    params: FilterPage,
    route: string
  ): Promise<ProductResponse> =>
    await axiosClient
      .get("/product/list", { params: { ...params, store: route } })
      .then((res) => res.data);

  const getProduct = async (
    params: FilterPage,
    keyword?: string
  ): Promise<ProductResponse> => {
    return await axiosClient
      .get("/product/list", { params: { ...params, keyword: keyword || "" } })
      .then((res) => res.data);
  };
  const getDetailProduct = async (id: string): Promise<ProductDetailResponse> =>
    await axiosClient.get(`/product/detail/${id}`).then((res) => res.data);

  const getRandom = async (): Promise<ProductRandomResponse> =>
    await axiosClient.get("/product/random").then((res) => res.data);

  const useProductByStore = (route: string) => {
    let [query, setQuery] = useState<FilterPage>(defaultFilter);
    let [filterQuery, setFilterQuery] = useState<FilterPage>(defaultFilter);
    console.log(filterQuery);
    const handlePage = (page: number) => {
      setFilterQuery((prev) => {
        return {
          ...prev,
          page: page,
        };
      });
      setQuery((prev) => ({ ...prev, page: page }));
    };
    const handlePageSize = (e: ChangeEvent<any>) => {
      setQuery((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
      setFilterQuery((params) => ({
        ...params,
        pageSize: e.target.value,
        page: 1,
      }));
    };
    const handleClear = () => {
      setFilterQuery(defaultFilter);
      setQuery(defaultFilter);
    };
    const { data, isLoading } = useQuery({
      queryKey: ["product/byStore", [filterQuery]],
      queryFn: () => getStoreProduct(filterQuery, route),
    });

    // console.log(data);

    return {
      data,
      isLoading,
      query,
      setQuery,
      setFilterQuery,
      handleClear,
      handlePage,
      handlePageSize,
    };
  };
  const useProducts = (keyword?: string) => {
    let [query, setQuery] = useState<FilterPage>(defaultFilter);
    let [filterQuery, setFilterQuery] = useState<FilterPage>(defaultFilter);
    console.log(filterQuery);
    const handlePage = (page: number) => {
      setFilterQuery((prev) => {
        return {
          ...prev,
          page: page,
        };
      });
      setQuery((prev) => ({ ...prev, page: page }));
    };
    const handlePageSize = (e: ChangeEvent<any>) => {
      setQuery((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
      setFilterQuery((params) => ({
        ...params,
        pageSize: e.target.value,
        page: 1,
      }));
    };
    const handleClear = () => {
      setFilterQuery(defaultFilter);
      setQuery(defaultFilter);
    };
    const { data, isLoading } = useQuery({
      queryKey: ["product/list", [filterQuery, keyword]],
      queryFn: () => getProduct(filterQuery, keyword),
    });

    // console.log(data);

    return {
      data,
      isLoading,
      query,
      setQuery,
      setFilterQuery,
      handleClear,
      handlePage,
      handlePageSize,
    };
  };

  const useRandomProduct =() => {
    const {data, isLoading} = useQuery({
      queryKey: ['product/random'],
      queryFn: () => getRandom(),
      refetchOnWindowFocus: false
    })

    return {data, isLoading}
  }

  const useDetailProduct = (id: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["product/detail", [id]],
      queryFn: () => getDetailProduct(id),
    });

    return { data, isLoading };
  };

  const useCreateProduct = (storeId: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (value: CreateProductPayload) =>
        await axiosAuthClient.post(`/product/create/${storeId}`, value),
      onSuccess(data, variables, context) {
        toast.success("product successfully");
        queryClient.invalidateQueries({
          queryKey: ["product/byStore"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useDeleteImage = (store: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: string) =>
        await axiosAuthClient.delete(`/product/delete-image/${store}/${e}`),
      onSuccess(data, variables, context) {
        toast.success("product image deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["product/byStore"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product/detail"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useUpdateProduct = (storeId: string, id: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: UpdateProductPayload) =>
        axiosAuthClient.put(`/product/update/${storeId}/${id}`, e),
      onSuccess(data, variables, context) {
        toast.success("product updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["product/byStore"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product/detail"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useDeleteProduct = (storeId: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: string) =>
        axiosAuthClient.delete(`/product/delete/${storeId}/${e}`),
      onSuccess(data, variables, context) {
        toast.success("product deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["product/byStore"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product/detail"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  return {
    useProductByStore,
    useDetailProduct,
    useCreateProduct,
    useDeleteImage,
    useUpdateProduct,
    useProducts,
    useDeleteProduct,
    useRandomProduct
  };
};

export default useProductModule;
