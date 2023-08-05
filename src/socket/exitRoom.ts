import { rooms } from "@/context/room";
import { ConnectionContext, SocketIO } from "@/@types/socket";

export const processExitRoom = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  if (!context.currentRoomId) return;
  const room = rooms[context.currentRoomId];
  if (!room) return;
  room.users = room.users.filter((user) => user != socket.id);
  if (room.users.length === 0) {
    delete rooms[context.currentRoomId];
  }
  void socket.leave(context.currentRoomId);
  socket.to(context.currentRoomId).emit("leave", { userId: socket.id });
  context.currentRoomId = undefined;
};
