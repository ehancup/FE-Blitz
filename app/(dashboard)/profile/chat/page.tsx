"use client";
import InputText from "@/components/inputText";
import { Suspense, useEffect, useRef, useState } from "react";
import socket from "../../../../utils/socket.utils";
// import { io } from "socket.io-client";
import useChatModule from "@/lib/chat";
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import ChatPage from "./chat";
import {
  formatDate,
  getDifferenceInDays,
  getIndonesiaTime,
} from "@/utils/date.utils";
import { useSearchParams } from "next/navigation";

// const socket = io(`http://${process.env.IP}`);
const Page = () => {
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get("room");
  let rmid = useRef<string>();
  const [room, setRoom] = useState<string>(initialRoom || "");
  console.log(room);
  const [input, setInput] = useState<string>("");
  const { useUserRoom } = useChatModule();
  const { data, isLoading } = useUserRoom();

  console.log(data);

  const selectRoom = (roomId: string) => {
    setRoom((prev) => {
      if (prev != "") socket.emit("leave_room", prev);

      return roomId;
    });
    socket.emit("join_room", roomId);
  };

  useEffect(() => {
    const leave = () => {
      console.log(rmid.current);
      if (rmid.current != "") {
        socket.emit("leave_room", rmid.current);
        console.log("leaving");
      }
    };
    return () => {
      leave();
      console.log("leave page caht");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rmid.current = room;
  }, [room]);

  // useEffect(() => {
  //   const addMessage = (i: string) => {
  //     console.log(i);
  //     setMessage((prev) => [...prev, i]);
  //   };
  //   socket.on("recieve_message", addMessage);

  //   return () => {
  //     socket.off("recieve_message", addMessage);
  //   };
  // });

  return (
    <div className="pt-5 flex flex-col">
      <div role="alert" className="alert ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          Now you can reply to chats from buyers and manage shops on Blitz
          Seller.
        </span>
      </div>
      <div className="w-full flex flex-row shadow-xl rounded-xl h-[calc(100vh-200px)] mt-4 overflow-hidden">
        <div className="w-72 bg-white h-full flex flex-col p-1 border-r border-gray-100">
          <div className="flex flex-row justify-between items-center pt-4 px-3">
            <h1 className="text-3xl font-bold">Chat</h1>
            <div className="btn btn-circle btn-sm btn-ghost">
              <Cog6ToothIcon className="h-5" />
            </div>
          </div>
          <div className="mt-3 px-3">
            <label className="input input-bordered flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 font-bold text-gray-500" />
              <input
                type="text"
                className="grow"
                placeholder="Search chat..."
              />
            </label>
          </div>
          <div className="flex-1 flex flex-col overflow-y-scroll mt-3">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center ">
                <span className="loading loading-spinner"></span>
              </div>
            ) : data?.data.length == 0 ? (
              <div className="w-full h-full flex justify-center mt-3 text-gray-300">
                find product and start chatting
              </div>
            ) : (
              data?.data.map((e, i) => {
                const date = getIndonesiaTime();
                const chatDate = new Date(e.chats[0].created_at).getTime();
                const diffDate = getDifferenceInDays(date.getTime(), chatDate);
                return (
                  <div
                    className={clsx(
                      "flex flex-row p-3 items-center gap-3 rounded-xl hover:bg-gray-500/20 transition-all duration-150",
                      {
                        "bg-blue-400/15": e.id == room,
                      }
                    )}
                    key={i}
                    onClick={() => selectRoom(e.id)}
                  >
                    <div
                      className="h-12 w-12 rounded-full overflow-hidden"
                      style={{
                        backgroundImage: `url(${e.store.avatar?.replace(
                          "http://localhost:5002",
                          process.env.IP as string
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }}
                    ></div>
                    <div className=" flex flex-col flex-1 ">
                      <div className="w-full flex-row flex items-center gap-2 justify-between">
                        <h1
                          className={clsx("font-medium text-lg line-clamp-1 text-ellipsis", {
                            // "text-blue-600": e.id == room,
                          })}
                        >
                          {e.store.name}
                        </h1>
                        {diffDate == 0 ? (
                          <p className="text-sm text-gray-500">
                            Today
                          </p>
                        ) : diffDate == 1 ? (
                          <p className="text-sm text-gray-500">
                            Yesterday
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                          {formatDate(e.chats[0]?.created_at, {
                            format: "short",
                          })}
                        </p>
                        )}
                        
                      </div>
                      <div className="w-full flex flex-row items-center justify-between gap-2">
                        <p className="text-sm text-gray-400 line-clamp-1 text-ellipsis">
                          {e.chats[0]?.message}
                        </p>
                        {e._count.chats > 0 ? (
                          <span className="badge badge-info badge-sm">
                            {e._count.chats}
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="flex-1 h-full">
          {room == "" ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 ">
              start chatting
            </div>
          ) : (
            <ChatPage id={room} />
          )}
        </div>
      </div>
    </div>
  );
};

export default function Pg() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}