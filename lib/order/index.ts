import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import {
  DetailOrderResponse,
  OrderPayload,
  OrderSellerResponse,
  OrderUserResponse,
  SingleOrderPayload,
  UpdateStatusPayload,
} from "./interface";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import useOrderPayload from "../hook/useOrderPayload";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { axiosClient } from "../axios/axiosClient";

interface OrderFilter {
  keyword: string;
  status:
    | ""
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller";
}

interface OrderSellerFilter {
  status:
    | ""
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller";
}

const defaultFilter: OrderFilter = {
  keyword: "",
  status: "",
};
const defaultSellerFilter: OrderSellerFilter = {
  status: "",
};

const useOrderModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const {
    payload: order,
    addPayload,
    addForce,
    addMany,
  } = useOrderPayload((p) => p);

  const getUserOrder = async (
    params: OrderFilter
  ): Promise<OrderUserResponse> =>
    await axiosAuthClient
      .get("/order/user-list", { params })
      .then((res) => res.data);
  const getSellerOrder = async (
    storeId: string,
    params: OrderSellerFilter
  ): Promise<OrderSellerResponse> =>
    await axiosAuthClient
      .get(`/order/seller-list/${storeId}`, { params })
      .then((res) => res.data);

  const getDetailOrder = async (id: string): Promise<DetailOrderResponse> =>
    await axiosClient.get(`/order/detail/${id}`).then((res) => res.data);
  const useCreateOrder = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: OrderPayload) =>
        await axiosAuthClient.post("/order/create", e),
      onSuccess(data, variables, context) {
        // toast.success("set value");
        queryClient.invalidateQueries({
          queryKey: ["cart/myCart"],
        });
        queryClient.invalidateQueries({
          queryKey: ["cart/myRealCart"],
        });
        addForce([]);
        console.log(data);

        toast.success("order success");
      },
      onError(error: AxiosError<any>, variables, context) {
        console.log(error);
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useCreateSingleOrder = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: SingleOrderPayload) =>
        await axiosAuthClient.post("/order/create-single", e),
      onSuccess(data, variables, context) {
        toast.success("success order");
        queryClient.invalidateQueries({
          queryKey: ["product/byStore"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product/detail"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useUserOrder = () => {
    const [query, setQuery] = useState<OrderFilter>(defaultFilter);
    const [filterQuery, setFilterQuery] = useState<OrderFilter>(defaultFilter);

    const handleClear = () => {
      setQuery(defaultFilter);
      setFilterQuery(defaultFilter);
    };

    const { data, isLoading } = useQuery({
      queryKey: ["order/user", [filterQuery]],
      queryFn: () => getUserOrder(filterQuery),
      refetchOnWindowFocus: false,
      enabled: !!session,
    });

    return { data, isLoading, query, setQuery, setFilterQuery, handleClear };
  };

  const useSellerOrder = (storeId: string) => {
    const [query, setQuery] = useState<OrderSellerFilter>(defaultSellerFilter);
    const [filterQuery, setFilterQuery] =
      useState<OrderSellerFilter>(defaultSellerFilter);
    const handleClear = () => {
      setQuery(defaultSellerFilter);
      setFilterQuery(defaultSellerFilter);
    };

    const { data, isLoading } = useQuery({
      queryKey: ["order/seller", [filterQuery]],
      queryFn: () => getSellerOrder(storeId, filterQuery),
      // refetchOnWindowFocus: false,
      enabled: !!session,
    });

    return { data, isLoading, query, setQuery, setFilterQuery, handleClear };
  };
  const useDtlOrder = (id: string) => {

    const { data, isLoading } = useQuery({
      queryKey: ["order/detail"],
      queryFn: () => getDetailOrder(id),
      refetchOnWindowFocus: false,
      // enabled: !!session,
    });

    return { data, isLoading };
  };

  const useDetailOrder = () => {
    const { mutate, data, isPending } = useMutation({
      mutationFn: async (id: string) =>
        await axiosClient.get(`/order/detail/${id}`),
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, data, isPending };
  };

  const useSetStatus = (id: string) => {
   const { mutate, isPending } = useMutation({
    mutationFn: async (e: UpdateStatusPayload) => await axiosAuthClient.put(`/order/set-status/${id}`, e),
    onSuccess(data, variables, context) {
      toast.success("status updated");
      queryClient.invalidateQueries({
        queryKey: ["order/user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/seller"],
      });
    },
    onError(error: AxiosError<any>, variables, context) {
      toast.error(error.response?.data.message);
    },
   })

   return {mutate, isPending}
  }
  const useCancelUser = (id: string) => {
   const { mutate, isPending } = useMutation({
    mutationFn: async () => await axiosAuthClient.put(`/order/set-status/${id}`, {status: 'cancel_user'}),
    onSuccess(data, variables, context) {
      toast.success("order canceled");
      queryClient.invalidateQueries({
        queryKey: ["order/user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/seller"],
      });
    },
    onError(error: AxiosError<any>, variables, context) {
      toast.error(error.response?.data.message);
    },
   })

   return {mutate, isPending}
  }
  const useCancelSeller = (id: string) => {
   const { mutate, isPending } = useMutation({
    mutationFn: async () => await axiosAuthClient.put(`/order/set-status/${id}`, {status: 'cancel_seller'}),
    onSuccess(data, variables, context) {
      toast.success("order canceled");
      queryClient.invalidateQueries({
        queryKey: ["order/user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order/seller"],
      });
    },
    onError(error: AxiosError<any>, variables, context) {
      toast.error(error.response?.data.message);
    },
   })

   return {mutate, isPending}
  }

  return {
    useCreateOrder,
    useCreateSingleOrder,
    useUserOrder,
    useDetailOrder,
    useSellerOrder,
    useDtlOrder,
    useSetStatus,
    useCancelUser,
    useCancelSeller
  };
};

export default useOrderModule;
