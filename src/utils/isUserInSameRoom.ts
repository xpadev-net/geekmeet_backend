import { UUID } from "@/@types/brands";
import { ConnectionContext } from "@/@types/socket";
import { rooms } from "@/context/room";

export const isUserInSameRoom = (
  context: ConnectionContext,
  targetUserId: UUID
) => {
  if (!context.currentRoomId) return false;
  const room = rooms[context.currentRoomId];
  if (!room) return false;
  return room.users.filter((user) => user.id === targetUserId).length > 0;
};
