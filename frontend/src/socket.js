import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000/discussion"; // match backend namespace

export const discussionSocket = io(SOCKET_URL, {
  withCredentials: true, // required since you are whitelisting IP
});