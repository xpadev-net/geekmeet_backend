import { ConnectionContext, SocketIO, StateChangeBody } from "@/@types/socket";

export const onStateChange = (socket: SocketIO, context: ConnectionContext) => {
  return (params: StateChangeBody) => {
    if (!context.currentRoomId) return;
    socket
      .to(context.currentRoomId)
      .emit("stateChange", { src: socket.id, data: params });
  };
};
