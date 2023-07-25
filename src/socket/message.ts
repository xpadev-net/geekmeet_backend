import { ConnectionContext, SendMessageBody, SocketIO } from "@/@types/socket";

export const onMessageHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (params: SendMessageBody) => {
    if (!context.currentRoomId) return;
    if (params.type === "private") {
      socket.to(params.dest).emit("message", params.data);
    } else {
      socket.to(context.currentRoomId).emit("message", params.data);
    }
  };
};
