import { io } from "socket.io-client";

const socket = io(`${process.env.IP}`);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("disconnect", () => {
  console.log("socket disconnected");
});

export default socket;
