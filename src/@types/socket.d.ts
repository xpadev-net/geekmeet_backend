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
      isPrivate: false;
      isLt: boolean;
    }
  | {
      isPrivate: true;
      isLt: boolean;
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

export type ClientToServerEvents = {
  createRoom: (param: CreateRoomBody) => void;
  joinRoom: (param: JoinRoomBody) => void;
  webrtcIce: (param: WebrtcIceBody) => void;
  webrtcSdp: (param: WebrtcSdpBody) => void;
  message: (param: SendMessageBody) => void;
  leaveRoom: () => void;
};
