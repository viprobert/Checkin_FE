import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:3600", {
      transports: ["websocket"],
    });
    socket.on("connect", () => console.log("✅ socket connected:", socket?.id));
    socket.on("disconnect", () => console.log("⚠️ socket disconnected"));
    socket.on("connect_error", (e) => console.log("❌ socket connect_error:", e?.message || e));
  }
  return socket;
}
