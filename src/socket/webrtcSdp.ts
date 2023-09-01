import { ConnectionContext, SocketIO, WebrtcSdpBody } from "@/@types/socket";
import { isUserInSameRoom } from "@/utils/isUserInSameRoom";

export const onWebrtcSdpHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (params: WebrtcSdpBody) => {
    if (!isUserInSameRoom(context, params.dest)) return;
    socket
      .to(params.dest)
      .emit("webrtcSdp", { description: params.description, src: socket.id });
  };
};
