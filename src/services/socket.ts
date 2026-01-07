import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE || "http://46.250.234.11:3600";

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socket.on("connect", () => console.log("✅ socket connected:", socket?.id));
    socket.on("disconnect", () => console.log("⚠️ socket disconnected"));
    socket.on("connect_error", (e) => console.log("❌ socket connect_error:", e?.message || e));
  }
  return socket;
}
