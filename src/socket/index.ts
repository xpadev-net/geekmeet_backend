import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ConnectionContext } from "@/@types/socket";
import { onCreateRoomHandler } from "@/socket/createRoom";
import { onJoinRoomHandler } from "@/socket/joinRoom";
import { onMessageHandler } from "@/socket/message";
import { processExitRoom } from "@/socket/exitRoom";
import { onWebrtcIceHandler } from "@/socket/webrtcIce";
import { onWebrtcSdpHandler } from "@/socket/webrtcSdp";

export const onConnectHandler = (
  socket: Socket<ClientToServerEvents, DefaultEventsMap>
) => {
  const context: ConnectionContext = {};

  socket.on("createRoom", onCreateRoomHandler(socket, context));
  socket.on("joinRoom", onJoinRoomHandler(socket, context));

  socket.on("webrtcIce", onWebrtcIceHandler(socket, context));
  socket.on("webrtcSdp", onWebrtcSdpHandler(socket, context));

  socket.on("message", onMessageHandler(socket, context));

  socket.on("leaveRoom", () => {
    processExitRoom(socket, context);
  });
  socket.on("disconnect", () => {
    processExitRoom(socket, context);
  });
  socket.on("error", () => {
    processExitRoom(socket, context);
  });
};
