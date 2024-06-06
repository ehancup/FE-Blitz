import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axios/axiosClient";
import { CreateEtalasePayload, EtalaseResponse } from "./interface";
import { AxiosError } from "axios";
import useAxiosAuth from "../hook/useAxiosAuth";
import toast from "react-hot-toast";

const useEtalaseModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const getStoreEtalase = async (store: string): Promise<EtalaseResponse> =>
    await axiosClient.get(`/etalase/list/${store}`).then((res) => res.data);

  const useEtalaseByStore = (store: string) => {
    const {data, isLoading} = useQuery({
        queryKey: ["etalase/byStore"],
        queryFn: () => getStoreEtalase(store)
    })

    return {data, isLoading}
  }

  const useCreateEtalase = (storeId: string) => {
    const {mutate, isPending} = useMutation({
      mutationFn: async (e: CreateEtalasePayload) => await axiosAuthClient.post(`/etalase/create/${storeId}`, e),
      onSuccess(data, variables, context) {
        toast.success("etalase created")
        queryClient.invalidateQueries({
          queryKey: ["etalase/byStore"]
        })
      }, 
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message)
      },
    })

    return {mutate, isPending}
  }

  return {useEtalaseByStore , useCreateEtalase}
};

export default useEtalaseModule;
