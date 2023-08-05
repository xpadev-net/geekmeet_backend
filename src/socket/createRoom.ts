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
    socket.emit("createRoom", { code: 200, roomId });
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
  if (!param.isPrivate) {
    return {
      type: "unlisted",
      id: roomId,
      isLt: param.isLt,
      owner: userId,
      users: [],
    };
  }
  return {
    type: "private",
    id: roomId,
    isLt: param.isLt,
    owner: userId,
    allowed: param.allowed,
    users: [],
  };
};
