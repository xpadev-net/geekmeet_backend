import { Server } from "socket.io";
import * as https from "https";
import { onConnectHandler } from "@/socket";
import { ClientToServerEvents } from "@/@types/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExpressCorsHost } from "@/config";

const setupSocketIO = (server: https.Server<any, any>) => {
  const io = new Server<ClientToServerEvents, DefaultEventsMap>(server, {
    cors: {
      origin: ExpressCorsHost,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", onConnectHandler);
};

export { setupSocketIO };
