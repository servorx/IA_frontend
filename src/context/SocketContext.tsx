import { createContext, useContext, useEffect } from "react";
import { socket } from "../api/socket";

const SocketContext = createContext(socket);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Socket conectado:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket desconectado");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
