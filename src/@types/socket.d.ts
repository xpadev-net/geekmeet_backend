import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UUID } from "@/@types/brands";

export type SocketIO = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type ConnectionContext = {
  currentRoomId?: UUID;
  email?: string;
};

export type CreateRoomBody =
  | {
      type: "unlisted";
    }
  | {
      type: "private";
      allowed: string[];
    };

export type JoinRoomBody = {
  roomId: UUID;
};

export type SendMessageBody =
  | {
      type: "private";
      dest: UUID;
      data: unknown;
    }
  | {
      type: "public";
      data: unknown;
    };

export type WebrtcSdpBody = {
  description: RTCSessionDescription;
  dest: UUID;
};

export type WebrtcIceBody = {
  candidate: RTCIceCandidate;
  dest: UUID;
};
