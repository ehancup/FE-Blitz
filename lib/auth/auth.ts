import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axios/axiosClient";
import {
  ForgotPassPayload,
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  ResetPassPayload,
} from "./interface";
import toast from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";
import { AxiosResponse, AxiosError } from "axios";
import { Success } from "@/components/toast";
import useAxiosAuth from "../hook/useAxiosAuth";

export const useAuthModule = () => {
  const { data: session } = useSession();
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();

  // const getProfile = async () : Promise<AxiosResponse<ProfileResponse> | any> => {
  //   return await  axiosClient.get("/auth/profile", {
  //     headers: {
  //       Authorization: `Bearer ${session?.user.accessToken}`
  //     }
  //   }).catch((err: AxiosError) => {
  //     if (err.response?.status == 402) {
  //       return axiosClient.get("/auth/refresh-token", {
  //         headers: {
  //           Authorization: `Bearer ${session?.user.refreshToken}`
  //         }
  //       }).then(async (e: AxiosResponse<LoginResponse>) => {
  //         await signIn("credentials", {
  //           ...e.data.data,
  //           redirect: false
  //         })

  //         const profile : AxiosResponse<ProfileResponse> = await axiosClient.get("/auth/profile",{
  //           headers: {
  //             Authorization: `Bearer ${e.data.data.access_token}`
  //           }
  //         })

  //         return profile
  //       }).catch((err) => {
  //         toast.error("youre session has ended")
  //         signOut()
  //       })
  //     } else {
  //       toast.error("youre session has ended")
  //         signOut()
  //     }
  //   }).then((e) => e)
  // }

  const getProfile = async (): Promise<ProfileResponse> => {
    return await axiosAuthClient
      .get("/auth/profile")
      .then((response) => response.data);
  };
  const useRegister = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (e: RegisterPayload) => axiosClient.post("/auth/register", e),
      onSuccess(data, variables, context) {
        toast.success("registration successful");
      },
      onError(error: any, variables, context) {
        toast.error(error.response.data.message);
        console.log(error);
      },
    });

    return { mutate, isPending };
  };

  const useLogin = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (e: LoginPayload) => axiosClient.post("/auth/login", e),
      async onSuccess(data: AxiosResponse<LoginResponse>, variables, context) {
        toast.success("login successful");
        console.log(data.data.data.email);
        await signIn("credentials", {
          ...data.data.data,
          redirect: false,
        });
      },
      onError(error: any, variables, context) {
        toast.error(error.response.data.message);
        toast.error("something went wrong");
        console.log(error);
      },
    });
    return { mutate, isPending };
  };

  const useProfile = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["auth/profile"],
      queryFn: () => getProfile(),
      enabled: !!session,
    });

    return { data, isLoading };
  };

  const useSetAvatar = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: File | undefined) => {
        if (!e) {
          toast.error("please enter image");
          return;
        }

        const compiled = new FormData();
        compiled.append("file", e);

        const response = await axiosClient.post("/upload/file", compiled, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status !== 201) {
          toast.error((response as any).response.data.message);
          return;
        } else {
          return axiosAuthClient.put("/auth/set-avatar", {
            avatar: response.data.data.file_url,
          });
        }
      },
      onSuccess(data, variables, context) {
        toast.success("set avatar success");
        queryClient.invalidateQueries({
          queryKey: ["auth/profile"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useForgotPassword = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: ForgotPassPayload) =>
        await axiosClient.post("/auth/forgot-password", e),
      onSuccess(data, variables, context) {
        toast.success("email sent");
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useResetPassword = (id: string, token: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: ResetPassPayload) =>
        await axiosClient.post(`/auth/reset-password/${id}/${token}`, e),
      onSuccess(data, variables, context) {
        toast.success("password reset successfully");
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  return {
    useRegister,
    useLogin,
    useProfile,
    useSetAvatar,
    useForgotPassword,
    useResetPassword,
  };
};
