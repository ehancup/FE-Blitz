import { Store } from "../store/interface";

interface UserChatRoom {
  id: string;
  store: Store;
  chats: {
    message: string;
    created_at: string;
  }[];
  _count: {
    chats: number;
  };
}

export interface UserChatRoomResponse {
  data: UserChatRoom[];
}

interface DetailRoom {
  id: string;
  store: Store;
  user: {
    id: string
    name: string;
    avatar: string;
    role: "user" | "seller";
    email: string;
  };
}

export interface DetailRoomResponse {
  data: DetailRoom;
}

export interface UserChat {
  id: string;
  sender: "seller" | "user";
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserChatResponse {
  data: UserChat[];
}

export interface GroupedUserChat {
  id: string;
  date: string;
  chats: UserChat[];
}

export interface UserSendPayload {
  message: string;
}

export interface UserCreateRoomResponse {
  data: {
    id: string;
  };
}

interface StoreChatRoom {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  chats: {
    message: string;
    created_at: string;
  }[];
  _count: {
    chats: number;
  };
}

export interface StoreChatRoomResponse {
  data: StoreChatRoom[];
}

export interface StoreChat extends UserChat {}

export interface StoreChatResponse {
  data: StoreChat[];
}

export interface GroupedStoreChat {
  id: string;
  date: string;
  chats: StoreChat[];
}

export interface StoreSendPayload extends UserSendPayload {}
