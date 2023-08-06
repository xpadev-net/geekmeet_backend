import { ChatBody, ConnectionContext, SocketIO } from "@/@types/socket";
import { uuid } from "@/utils/uuid";

export const onChatHandler = (socket: SocketIO, context: ConnectionContext) => {
  return (params: ChatBody) => {
    if (!context.currentRoomId) return;
    const body = {
      id: uuid(),
      name: context.name,
      src: socket.id,
      content: params.content,
    };
    socket.to(context.currentRoomId).emit("chat", body);
    socket.emit("chat", body);
  };
};
