import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { WishlistResponse } from "./interface";
import { ChangeEvent, useState } from "react";

const defaultFilter: FilterPage = {
  keyword: "",
  type: "",
  from_price: "",
  to_price: "",
  page: 1,
  pageSize: 20,
};

interface FilterPage {
  keyword: string;
  type: "pre_order" | "ready_stok" | "";
  from_price: number | undefined | string;
  to_price: number | undefined | string;
  page: number;
  pageSize: number;
}

const useWishlistModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();

  const getMyWishlist = async (params: FilterPage): Promise<WishlistResponse> =>
    await axiosAuthClient.get("/wishlist/my-list", { params }).then((response) => response.data);

  const useCreateWishlist = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: string) =>
        axiosAuthClient.post(`/wishlist/add/${e}`),
      onSuccess(data, variables, context) {
        toast.success(data.data.message);
        queryClient.invalidateQueries({
          queryKey: ['wislist/myList']
        })
        // queryClient.invalidateQueries({
        //   queryKey: ["product/detail"]
        // })
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useMyWishlist = () => {
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

    const {data, isLoading} = useQuery({
      queryKey: ['wislist/myList', [filterQuery]],
      queryFn: () => getMyWishlist(filterQuery)
    })

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

  return { useCreateWishlist, useMyWishlist };
};

export default useWishlistModule;
