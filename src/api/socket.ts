import { io }from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const socket = io(SOCKET_URL, {
  path: "/ws/socket.io",
    transports: ["polling"], // en dev
    autoConnect: false,      // controlamos cuando conectar
});
