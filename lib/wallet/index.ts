import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { TopupPayload, WalletResponse } from "./interface";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const useWalletModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const getMyWallet = async (): Promise<WalletResponse> =>
    await axiosAuthClient.get("/wallet/my-wallet").then((res) => res.data);

  const useMyWallet = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["wallet/myWallet"],
      queryFn: () => getMyWallet(),
      enabled: !!session,
    });

    return { data, isLoading };
  };

  const useTopupWallet = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: TopupPayload) =>
        axiosAuthClient.post("/wallet/topup", e),
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ["wallet/myWallet"],
        });

        toast.success("topup success");
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending }
  };

  return { useMyWallet, useTopupWallet };
};

export default useWalletModule;
