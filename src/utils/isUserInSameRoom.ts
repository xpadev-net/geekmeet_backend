import { ConnectionContext } from "@/@types/socket";
import { rooms } from "@/context/room";
import { UUID } from "@/@types/brands";

export const isUserInSameRoom = (
  context: ConnectionContext,
  targetUserId: UUID
) => {
  if (!context.currentRoomId) return false;
  const room = rooms[context.currentRoomId];
  if (!room) return false;
  return room.users.filter((user) => user.id === targetUserId).length > 0;
};
