"use client";
import useChatModule from "@/lib/chat";
import {
  formatDate,
  getDifferenceInDays,
  getIndonesiaTime,
} from "@/utils/date.utils";
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import socket from "@/utils/socket.utils";
import ChatPage from "./chat";

const Page = () => {
  const params = useParams();
  let rmid = useRef<string>();
  const [room, setRoom] = useState<string>("");
  const { useStoreRoom } = useChatModule();
  const { data, isLoading } = useStoreRoom(params.id as string);
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

  return (
    <div className="w-full h-[780px] flex ">
      <div className="grow flex items-center justify-center ">
        {" "}
        {/** jangan dihapus div nya */}
        <div className="w-full max-w-[1000px] h-full bg-white flex flex-row shadow-xl rounded-xl overflow-hidden">
          <div className="w-72 bg-white h-full flex flex-col p-1 border-r border-gray-100">
            <div className="flex flex-row justify-between items-center pt-4 px-3">
              <h1 className="text-3xl font-bold">Store Chat</h1>
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
                  const date = getIndonesiaTime().getTime();
                  const chatDate = new Date(e.chats[0].created_at).getTime();
                  const diffDate = getDifferenceInDays(date, chatDate);
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
                          backgroundImage: `url(${e.user.avatar?.replace(
                            "http://localhost:5002",
                            process.env.IP as string
                          )})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      ></div>
                      <div className=" flex flex-col flex-1 ">
                        <div className="w-full flex-row flex items-center justify-between">
                          <h1
                            className={clsx("font-medium text-lg", {
                              // "text-blue-600": e.id == room,
                            })}
                          >
                            {e.user.name}
                          </h1>
                          {diffDate == 0 ? (
                            <p className="text-sm text-gray-500">Today</p>
                          ) : diffDate == 1 ? (
                            <p className="text-sm text-gray-500">Yesterday</p>
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
              <ChatPage id={room} store={params.id as string} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
