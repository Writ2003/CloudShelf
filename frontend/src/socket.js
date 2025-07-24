import { io } from "socket.io-client";

const DISCUSSION_SOCKET_URL = "http://localhost:5000/discussion"; // match backend namespace
const COUPLE_SOCKET_URL = "http://localhost:5000/couple"

export const discussionSocket = io(DISCUSSION_SOCKET_URL, {
  withCredentials: true, // required since you are whitelisting IP
  transports: ["websocket"],
  autoConnect: false
});

export const coupleSocket = io(COUPLE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false
})