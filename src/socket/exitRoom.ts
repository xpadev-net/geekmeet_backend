import { ConnectionContext, SocketIO } from "@/@types/socket";
import { rooms } from "@/context/room";

export const processExitRoom = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  if (!context.currentRoomId) return;
  const room = rooms[context.currentRoomId];
  if (!room) return;
  room.users = room.users.filter((user) => user.id != socket.id);
  if (room.users.length === 0) {
    const roomId = context.currentRoomId;
    if (room.timer) clearTimeout(room.timer);
    room.timer = setTimeout(() => {
      delete rooms[roomId];
    }, 1000 * 60 * 5);
  }
  void socket.leave(context.currentRoomId);
  socket.to(context.currentRoomId).emit("leave", { userId: socket.id });
  context.currentRoomId = undefined;
};
