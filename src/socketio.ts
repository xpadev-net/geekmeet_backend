import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server, Socket } from "socket.io";
import { rooms } from "@/context/room";
import { UUID } from "@/@types/brands";
import { uuid } from "@/utils/uuid";
import { Room } from "@/@types/room";
import * as https from "https";

type CreateRoomBody =
  | {
      type: "unlisted";
    }
  | {
      type: "private";
      allowed: string[];
    };

type JoinRoomBody = {
  roomId: UUID;
};

type SendMessageBody =
  | {
      type: "private";
      dest: string;
      data: unknown;
    }
  | {
      type: "public";
      data: unknown;
    };

const setupSocketIO = (server: https.Server<any, any>) => {
  const io = new Server(server);
  const onConnectHandler = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.log("socket connected");
    const email: string | undefined = undefined;
    let currentRoomId: UUID | undefined;

    socket.on("createRoom", (param: CreateRoomBody) => {
      const roomId = getUniqueRoomId();
      rooms[roomId] = createRoom(param, roomId, socket.id);
      currentRoomId = roomId;
      void socket.join(roomId);
    });

    socket.on("joinRoom", (param: JoinRoomBody) => {
      const room = rooms[param.roomId];
      if (!room) {
        socket.emit("joinRoom", { code: 404, message: "room not found" });
        return;
      }
      if (room.type === "private") {
        if (!email) {
          socket.emit("joinRoom", {
            code: 403,
            message: "authenication required",
          });
          return;
        }
        if (!room.allowed.includes(email)) {
          socket.emit("joinRoom", { code: 403, message: "not allowed" });
          return;
        }
      }
      currentRoomId = room.id;
      socket.to(room.id).emit("connecting", { userId: socket.id });
      void socket.join(room.id);
      socket.emit("joinRoom", { code: 200, users: room.users });
      room.users.push(socket.id);
    });

    socket.on("message", (params: SendMessageBody) => {
      if (!currentRoomId) return;
      if (params.type === "private") {
        socket.to(params.dest).emit("message", params.data);
      } else {
        socket.to(currentRoomId).emit("message", params.data);
      }
    });

    const exitRoom = () => {
      if (!currentRoomId) return;
      const room = rooms[currentRoomId];
      if (!room) return;
      room.users = room.users.filter((user) => user != socket.id);
      void socket.leave(currentRoomId);
      socket.to(currentRoomId).emit("leave", { userId: socket.id });
      currentRoomId = undefined;
    };

    socket.on("leaveRoom", () => {
      exitRoom();
    });

    socket.on("disconnect", () => {
      exitRoom();
    });
    socket.on("error", () => {
      exitRoom();
    });
  };
  io.on("connection", onConnectHandler);
};

export { setupSocketIO };

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
