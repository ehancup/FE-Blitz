import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { AxiosError } from "axios";
import {
  CartAmountPayload,
  CartAmountResponse,
  CartResponse,
  CreateCartDto,
  GroupedByStoreItem,
  UpdateQtyPayload,
} from "./interface";
import toast from "react-hot-toast";
import { groupCartItemsByStore } from "@/app/(other)/cart/page";
import { useSession } from "next-auth/react";
// import { Session } from "inspector";

const useCartModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const getMyCart = async (): Promise<CartResponse> =>
    await axiosAuthClient.get("/cart/my-cart").then((res) => res.data);
  const getTotalAmount = async (e: CartAmountPayload) : Promise<CartAmountResponse> =>
    await axiosAuthClient.post("/cart/get-amount", e).then((res) => res.data);
  const useCreateCart = (productId: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: CreateCartDto) =>
        await axiosAuthClient.post(`/cart/add/${productId}`, e),
      onSuccess(data, variables, context) {
        toast.success("add to cart");
        queryClient.invalidateQueries({
          queryKey: ["cart/myCart"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  const useMyCart = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["cart/myCart"],
      queryFn: () => getMyCart(),
      refetchOnWindowFocus: false,
      enabled: !!session,
      select: (data): GroupedByStoreItem[] => {
        const grouped = groupCartItemsByStore(data.data);

        return grouped;
      },
    });

    return { data, isLoading };
  };
  const useRealMyCart = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["cart/myRealCart"],
      queryFn: () => getMyCart(),
      refetchOnWindowFocus: false,
      enabled: !!session,
      // select: (data): GroupedByStoreItem[] => {
      //   const grouped = groupCartItemsByStore(data.data)

      //   return grouped
      // }
    });

    return { data, isLoading };
  };

  const useCartAmount = (e: string[]) => {
    const { data, isLoading } = useQuery({
      queryKey: ['cart/amount', [e]],
      queryFn: () => getTotalAmount({id: e}),
      refetchOnWindowFocus: false,
      enabled: !!session
    })

    return {data, isLoading}
  }

  const useUpdateQty = (cartId: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: UpdateQtyPayload) =>
        await axiosAuthClient.put(`/cart/update-qty/${cartId}`, e),
      onSuccess(data, variables, context) {
        // toast.success("set value");
        queryClient.invalidateQueries({
          queryKey: ["cart/myCart"],
        });
        queryClient.invalidateQueries({
          queryKey: ["cart/myRealCart"],
        });
        queryClient.invalidateQueries({
          queryKey: ["cart/amount"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  return { useCreateCart, useMyCart, useUpdateQty, useRealMyCart, useCartAmount };
};

export default useCartModule;
