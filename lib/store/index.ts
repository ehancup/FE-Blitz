import { useSession } from "next-auth/react"
import useAxiosAuth from "../hook/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateStorePayload, StoreDetailResponse, StoreResponse } from "./interface";
import { axiosClient } from "../axios/axiosClient";
import { CreateAddressPayload } from "../address/interface";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const useStoreModule = () => {
    const {data:session} = useSession();
    const axiosAuthClient = useAxiosAuth();
    const queryClient = useQueryClient()

    const getMyStore = async () : Promise<StoreResponse> => await axiosClient.get('/store/list', {
        params: {
            owner: session?.user.id
        }
    }).then((store) => store.data) 
    const getDetail = async (route :string) : Promise<StoreDetailResponse> => await axiosClient.get(`/store/detail/${route}`).then((store) => store.data) 
    const useMyStore = () => {
        const {data, isLoading} = useQuery({
            queryKey: ['store/myStore'],
            queryFn: () => getMyStore(),
            enabled: !!session
        })

        return {data, isLoading}
    }

    const useDetailStore = (route:string) => {
        const {data, isLoading, error, isError} = useQuery({
            queryKey: ['store/detail'],
            queryFn: () => getDetail(route)
        })

        return {data, isLoading, error, isError}
    }

    const useCreateStore = () => {
        const {mutate, isPending} = useMutation({
            mutationFn: (e: CreateStorePayload) => axiosAuthClient.post('/store/create', e),
            onSuccess(data, variables, context) {
                toast.success("update success")
                queryClient.invalidateQueries({
                  queryKey: ["store/myStore"]
                })
              },
              onError(error: AxiosError<any>, variables, context) {
                toast.error(error.response?.data.message)
              },
        })

        return {mutate, isPending}
    }

    return {useMyStore, useDetailStore, useCreateStore}
}

export default useStoreModule;