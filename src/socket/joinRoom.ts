import { rooms } from "@/context/room";
import { ConnectionContext, JoinRoomBody, SocketIO } from "@/@types/socket";

export const onJoinRoomHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (param: JoinRoomBody) => {
    const room = rooms[param.roomId];
    if (!room) {
      socket.emit("joinRoom", { code: 404, message: "room not found" });
      return;
    }
    if (room.type === "private") {
      if (!context.email) {
        socket.emit("joinRoom", {
          code: 403,
          message: "authenication required",
        });
        return;
      }
      if (!room.allowed.includes(context.email)) {
        socket.emit("joinRoom", { code: 403, message: "not allowed" });
        return;
      }
    }
    if (room.timer) clearTimeout(room.timer);
    context.currentRoomId = room.id;
    socket
      .to(room.id)
      .emit("connecting", { userId: socket.id, name: param.name });
    void socket.join(room.id);
    socket.emit("joinRoom", { code: 200, users: room.users });
    room.users.push({ id: socket.id, name: param.name });
  };
};
