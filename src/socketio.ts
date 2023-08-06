import { Server } from "socket.io";
import * as http from "http";
import { onConnectHandler } from "@/socket";
import { ClientToServerEvents, ServerToClientEvents } from "@/@types/socket";
import { ExpressCorsHost } from "@/config";

const setupSocketIO = (server: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: ExpressCorsHost,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", onConnectHandler);
};

export { setupSocketIO };
