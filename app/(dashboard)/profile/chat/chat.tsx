"use client";

import { UserBubble } from "@/components/chatBubble";
import useChatModule from "@/lib/chat";
import {
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import InputEmoji from "react-input-emoji";
import clsx from "clsx";
import {
  formatDate,
  formatHour,
  getDifferenceInDays,
  getIndonesiaTime,
} from "@/utils/date.utils";
import InputText from "@/components/inputText";
import { useEffect, useRef, useState } from "react";
// import socket from "@/utils/socket.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface ChatPageProps {
  id: string;
  socket: undefined | Socket;
}

const ChatPage = ({ id, socket }: ChatPageProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { useDetailRoom, useUserChat, useUserSend } = useChatModule();
  const { data: detail, isLoading: detailLoad } = useDetailRoom(id);
  const { data: chat, isLoading: chatLoad } = useUserChat(id);
  const { mutate: send, isPending } = useUserSend(id);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  };

  const sendMessage = () => {
    if (message != "") {
      send(
        { message },
        {
          onSuccess(data, variables, context) {
            setMessage("");
            scrollToBottom();
            socket?.emit("user_send", { room: id, id: detail?.data.store.id });
          },
        }
      );
    } else {
    }
  };

  useEffect(() => scrollToBottom(), [chat]);

  useEffect(() => {
    socket?.on("user_recieve", (i) => {
      console.log(i);
      console.log("use menerima pesan baru");
      queryClient.invalidateQueries({
        queryKey: ["chat/user-chat"],
      });
    });

  });

  // useEffect(() => {
  //   if (!chatLoad) scrollToBottom();
  //   console.log("chat change", chatLoad);
  // }, [id, chatLoad]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full bg-white p-3 flex flex-row items-center justify-between">
        {detailLoad ? (
          <div className="">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-3">
            <div
              className="h-14 w-14 rounded-full overflow-hidden"
              style={{
                backgroundImage: `url(${detail?.data.store.avatar?.replace(
                  "http://localhost:5002",
                  process.env.IP as string
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
            <div className="">
              <h1 className="font-medium text-xl">{detail?.data.store.name}</h1>
            </div>
          </div>
        )}
        <div className="">
          <button className="btn btn-circle btn-ghost">
            <EllipsisVerticalIcon className="h-8" />
          </button>
        </div>
      </div>
      {chatLoad ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col gap-2 px-3 overflow-y-scroll relative">
          <div className="mt-3"></div>
          {chat?.map((e, i) => {
            const chatDate = new Date(e.date).getTime();
            const date = getIndonesiaTime();
            const diffDate = getDifferenceInDays(date.getTime(), chatDate);
            // console.log(getDifferenceInDays(date.getTime(), chatDate));

            return (
              <div className="flex flex-col gap-2" key={i}>
                {diffDate == 0 ? (
                  <p className="self-center text-gray-400 text-sm sticky top-2 badge-nuetral badge-outline bg-white badge">
                    Today
                  </p>
                ) : diffDate == 1 ? (
                  <p className="self-center text-gray-400 text-sm sticky top-2 badge-nuetral badge-outline bg-white badge">
                    Yesterday
                  </p>
                ) : (
                  <p className="self-center text-gray-400 text-sm sticky top-2 badge-nuetral badge-outline bg-white badge">
                    {formatDate(e.date)}
                  </p>
                )}

                {e.chats.map((k, j) => {
                  return <UserBubble data={k} key={j} />;
                })}
              </div>
            );
          })}
          <div className="" ref={messagesEndRef}></div>
        </div>
      )}
      <div className="p-5 flex flex-row w-full items-end gap-3">
        <div className="flex-1">
          <InputText
            id="message"
            name="messaage"
            placeholder="Type message"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
            value={message}
          />
        </div>
        <div className="">
          <button className="btn btn-square btn-neutral" onClick={sendMessage}>
            <PaperAirplaneIcon className="h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
