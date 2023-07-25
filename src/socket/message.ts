import { ConnectionContext, SendMessageBody, SocketIO } from "@/@types/socket";
import { isUserInSameRoom } from "@/utils/isUserInSameRoom";

export const onMessageHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (params: SendMessageBody) => {
    if (!context.currentRoomId) return;
    if (params.type === "private") {
      if (!isUserInSameRoom(context, params.dest)) return;
      socket.to(params.dest).emit("message", params.data);
    } else {
      socket.to(context.currentRoomId).emit("message", params.data);
    }
  };
};
