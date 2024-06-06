import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { AddressDetailResponse, AddressResponse, CreateAddressPayload, UpdateAddressPayload } from "./interface";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { axiosClient } from "../axios/axiosClient";

const defaultFilter = {
  keyword: "",
  page: 1,
  pageSize: 20
}

interface FilterPage {
  keyword: string;
  page: number;
  pageSize: number;
}

const useAddressModule = () => {
  const { data: session } = useSession();
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const getMyAddress = async (params : FilterPage): Promise<AddressResponse> =>
    await axiosAuthClient
  .get("/address/my-address", {params})
  .then((response) => response.data);
  const getDetailAddress = async (id:string) : Promise<AddressDetailResponse> => {
    return await axiosClient.get(`/address/detail/${id}`).then((response) => response.data)
  }
  const useMyAddress = () => {
    let [query, setQuery] = useState<FilterPage>(defaultFilter)
    let [filterQuery, setFilterQuery] = useState<FilterPage>(defaultFilter)
    console.log(filterQuery);
    const handlePage = (page: number) => {
      setFilterQuery((prev) => {
        return {
          ...prev,
          page: page
        }
      })
      setQuery((prev) => ({...prev, page: page}))
    }
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
      setQuery(defaultFilter)
    }
    const { data, isLoading } = useQuery({
      queryKey: ["address/my-address", [filterQuery]],
      queryFn: () => getMyAddress(filterQuery),
      enabled: !!session,
    });

    return { data, isLoading, query, setQuery, setFilterQuery, handleClear, handlePage, handlePageSize  };
  };

  const useCreateAddress = () => {
    const {mutate, isPending} = useMutation({
      mutationFn: async (e : CreateAddressPayload) => await axiosAuthClient.post('/address/create', e),
      onSuccess(data, variables, context) {
        toast.success("address created successfully")
        queryClient.invalidateQueries({
          queryKey: ["address/my-address"]
        })
      }, 
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message)
      },
      
    })

    return {mutate, isPending}
  }

  const useDeleteAddress = () => {
    const {mutate, isPending} = useMutation({
      mutationFn: (e: string) => axiosAuthClient.delete(`/address/del-my-address/${e}`),
      onSuccess(data, variables, context) {
        toast.success('deleted successfully')
        queryClient.invalidateQueries({
          queryKey: ["address/my-address"]
        })
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message)
      },
    })

    return {mutate, isPending}
  }

  const useDetailAddress = (id:string) => {
    const {data, isLoading, error, isError} = useQuery({
      queryKey: ["address/detail"],
      queryFn: () => getDetailAddress(id),
    })

    return {data, isLoading, error, isError}
  } 

  const useUpdateAddress = (id:string) => {
    const {mutate, isPending} = useMutation({
      mutationFn: (e: UpdateAddressPayload) => axiosAuthClient.put(`/address/update/${id}`, e),
      onSuccess(data, variables, context) {
        toast.success("update success")
        queryClient.invalidateQueries({
          queryKey: ["address/my-address"]
        })
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message)
      },
    })

    return {mutate, isPending}
  }
  return {useMyAddress, useCreateAddress, useDeleteAddress, useDetailAddress, useUpdateAddress}
};

export default useAddressModule;