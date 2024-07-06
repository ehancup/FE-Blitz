import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { AxiosError, AxiosResponse } from "axios";
import {
  DetailRoomResponse,
  GroupedStoreChat,
  GroupedUserChat,
  StoreChat,
  StoreChatResponse,
  StoreChatRoomResponse,
  StoreSendPayload,
  UserChat,
  UserChatResponse,
  UserChatRoomResponse,
  UserCreateRoomResponse,
  UserSendPayload,
} from "./interface";
import { useSession } from "next-auth/react";
import { axiosClient } from "../axios/axiosClient";
import toast from "react-hot-toast";

const useChatModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const getUserRoom = async (): Promise<UserChatRoomResponse> =>
    await axiosAuthClient.get("/chat/user-room").then((res) => res.data);

  const getDetailRoom = async (id: string): Promise<DetailRoomResponse> =>
    await axiosClient.get(`/chat/room-detail/${id}`).then((res) => res.data);

  const getUserChat = async (id: string): Promise<UserChatResponse> =>
    await axiosAuthClient.get(`/chat/user-chat/${id}`).then((res) => res.data);

  const useUserRoom = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["chat/user-room"],
      queryFn: () => getUserRoom(),
      enabled: !!session,
      refetchOnWindowFocus: false,
    });

    return { data, isLoading };
  };

  const useDetailRoom = (roomId: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["chat/detail-room", [roomId]],
      queryFn: () => getDetailRoom(roomId),
      refetchOnWindowFocus: false,
    });

    return { data, isLoading };
  };

  const useUserChat = (roomId: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["chat/user-chat", [roomId]],
      queryFn: () => getUserChat(roomId),
      enabled: !!session,
      refetchOnWindowFocus: false,
      select: (data) => {
        console.log(data);
        const extractDate = (datetimeStr: string): string => {
          return new Date(datetimeStr).toISOString().split("T")[0];
        };
        const groupedChatsArray: GroupedUserChat[] = [];

        const groupedChats: {
          [key: string]: { date: string; chats: UserChat[] };
        } = {};

        data.data.forEach((chat) => {
          const chatDate = extractDate(chat.created_at);
          if (!groupedChats[chatDate]) {
            groupedChats[chatDate] = { date: chat.created_at, chats: [] };
          }
          groupedChats[chatDate].chats.push(chat);
        });

        for (const [date, { date: createdAt, chats }] of Object.entries(
          groupedChats
        )) {
          groupedChatsArray.push({ id: date, date: createdAt, chats });
        }

        return groupedChatsArray;
      },
    });

    return { data, isLoading };
  };

  const useUserSend = (roomId: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: UserSendPayload) =>
        await axiosAuthClient.post(`/chat/user-send/${roomId}`, e),
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ["chat/user-chat"],
        });
        queryClient.invalidateQueries({
          queryKey: ["chat/user-room"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useUserCreateRoom = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (
        storeId: string
      ): Promise<AxiosResponse<UserCreateRoomResponse>> =>
        await axiosAuthClient.post(`/chat/user-create-room/${storeId}`),
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  //? store chat func

  const getStoreRoom = async (id: string): Promise<StoreChatRoomResponse> =>
    await axiosAuthClient.get(`/chat/store-room/${id}`).then((res) => res.data);

  const getStoreChat = async (
    id: string,
    store: string
  ): Promise<StoreChatResponse> =>
    await axiosAuthClient
      .get(`/chat/store-chat/${store}/${id}`)
      .then((res) => res.data);

  const useStoreRoom = (id: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["chat/store-room"],
      enabled: !!session,
      refetchOnWindowFocus: false,
      queryFn: () => getStoreRoom(id),
    });

    return { data, isLoading };
  };

  const useStoreChat = (room: string, store: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["chat/store-chat", [room]],
      queryFn: () => getStoreChat(room, store),
      enabled: !!session,
      refetchOnWindowFocus: false,
      select: (data) => {
        console.log(data);
        const extractDate = (datetimeStr: string): string => {
          return new Date(datetimeStr).toISOString().split("T")[0];
        };
        const groupedChatsArray: GroupedStoreChat[] = [];

        const groupedChats: {
          [key: string]: { date: string; chats: StoreChat[] };
        } = {};

        data.data.forEach((chat) => {
          const chatDate = extractDate(chat.created_at);
          if (!groupedChats[chatDate]) {
            groupedChats[chatDate] = { date: chat.created_at, chats: [] };
          }
          groupedChats[chatDate].chats.push(chat);
        });

        for (const [date, { date: createdAt, chats }] of Object.entries(
          groupedChats
        )) {
          groupedChatsArray.push({ id: date, date: createdAt, chats });
        }

        return groupedChatsArray;
      },
    });

    return { data, isLoading };
  };

  const useStoreSend = (store: string, room: string) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (e: StoreSendPayload) =>
        await axiosAuthClient.post(`/chat/store-send/${store}/${room}`, e),
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ["chat/store-chat"],
        });
        queryClient.invalidateQueries({
          queryKey: ["chat/store-room"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return {mutate, isPending}
  };

  return {
    useUserRoom,
    useDetailRoom,
    useUserChat,
    useUserSend,
    useUserCreateRoom,
    useStoreRoom,
    useStoreChat,
    useStoreSend
  };
};

export default useChatModule;
