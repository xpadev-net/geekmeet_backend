import { Server } from "socket.io";
import * as https from "https";
import { onConnectHandler } from "@/socket";

const setupSocketIO = (server: https.Server<any, any>) => {
  const io = new Server(server);
  io.on("connection", onConnectHandler);
};

export { setupSocketIO };
