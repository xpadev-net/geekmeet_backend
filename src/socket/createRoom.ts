import { rooms } from "@/context/room";
import { ConnectionContext, CreateRoomBody, SocketIO } from "@/@types/socket";
import { uuid } from "@/utils/uuid";
import { UUID } from "@/@types/brands";
import { Room } from "@/@types/room";

export const onCreateRoomHandler = (
  socket: SocketIO,
  context: ConnectionContext
) => {
  return (param: CreateRoomBody) => {
    const roomId = getUniqueRoomId();
    rooms[roomId] = createRoom(param, roomId, socket.id);
    context.currentRoomId = roomId;
    void socket.join(roomId);
  };
};
const getUniqueRoomId = () => {
  let roomId = uuid();
  while (rooms[roomId] !== undefined) {
    roomId = uuid();
  }
  return roomId;
};

const createRoom = (
  param: CreateRoomBody,
  roomId: UUID,
  userId: string
): Room => {
  if (param.type === "unlisted") {
    return {
      type: "unlisted",
      id: roomId,
      owner: userId,
      users: [],
    };
  }
  return {
    type: "private",
    id: roomId,
    owner: userId,
    allowed: param.allowed,
    users: [],
  };
};