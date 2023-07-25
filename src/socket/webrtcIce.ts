import { ConnectionContext, SocketIO, WebrtcIceBody } from "@/@types/socket";
import { isUserInSameRoom } from "@/utils/isUserInSameRoom";

export const onWebrtcIceHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (params: WebrtcIceBody) => {
    if (!isUserInSameRoom(context, params.dest)) return;
    socket
      .to(params.dest)
      .emit("webrtcIce", { candidate: params.candidate, src: socket.id });
  };
};
