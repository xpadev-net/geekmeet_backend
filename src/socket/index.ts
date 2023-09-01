import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { ClientToServerEvents, ConnectionContext } from "@/@types/socket";
import { onChatHandler } from "@/socket/chat";
import { onCreateRoomHandler } from "@/socket/createRoom";
import { processExitRoom } from "@/socket/exitRoom";
import { onJoinRoomHandler } from "@/socket/joinRoom";
import { onMessageHandler } from "@/socket/message";
import { onStateChange } from "@/socket/stateChange";
import { onWebrtcIceHandler } from "@/socket/webrtcIce";
import { onWebrtcSdpHandler } from "@/socket/webrtcSdp";

export const onConnectHandler = (
  socket: Socket<ClientToServerEvents, DefaultEventsMap>
) => {
  const context: ConnectionContext = {
    name: "",
  };

  socket.on("createRoom", onCreateRoomHandler(socket, context));
  socket.on("joinRoom", onJoinRoomHandler(socket, context));

  socket.on("webrtcIce", onWebrtcIceHandler(socket, context));
  socket.on("webrtcSdp", onWebrtcSdpHandler(socket, context));

  socket.on("message", onMessageHandler(socket, context));
  socket.on("chat", onChatHandler(socket, context));

  socket.on("leaveRoom", () => {
    processExitRoom(socket, context);
  });
  socket.on("disconnect", () => {
    processExitRoom(socket, context);
  });
  socket.on("error", () => {
    processExitRoom(socket, context);
  });

  socket.on("stateChange", onStateChange(socket, context));
};
