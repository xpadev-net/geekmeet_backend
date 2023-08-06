import { Socket } from "socket.io";
import { UUID } from "@/@types/brands";

export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents>;

export type User = { id: string; name: string };

export type ConnectionContext = {
  currentRoomId?: UUID;
  email?: string;
  name: string;
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
  name: string;
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

export type ChatBody = {
  content: string;
};

export type ClientToServerEvents = {
  createRoom: (param: CreateRoomBody) => void;
  joinRoom: (param: JoinRoomBody) => void;
  webrtcIce: (param: WebrtcIceBody) => void;
  webrtcSdp: (param: WebrtcSdpBody) => void;
  message: (param: SendMessageBody) => void;
  leaveRoom: () => void;
  chat: (param: ChatBody) => void;
};

export type ServerToClientEvents = {
  joinRoom: (param: JoinRoomResponse) => void;
  connecting: (param: ConnectingResponse) => void;
  leave: (param: LeaveResponse) => void;
  webrtcSdp: (param: WebrtcSdpResponse) => void;
  webrtcIce: (param: WebrtcIceResponse) => void;
  createRoom: (param: CreateRoomResponse) => void;
  message: (param: SendMessageResponse) => void;
  chat: (param: ChatResponse) => void;
};
export type ChatResponse = {
  id: UUID;
  content: string;
  src: string;
  name: string;
};

export type SendMessageResponse = {
  src: string;
  data: unknown;
};

export type CreateRoomResponse = {
  code: 200;
  roomId: UUID;
};
export type WebrtcSdpResponse = {
  description: RTCSessionDescription;
  src: string;
};
export type WebrtcIceResponse = {
  candidate: RTCIceCandidate;
  src: string;
};
export type LeaveResponse = { userId: string };
export type ConnectingResponse = { userId: string; name: string };

export type JoinRoomResponse =
  | {
      code: 404;
      message: string;
    }
  | {
      code: 403;
      message: string;
    }
  | {
      code: 200;
      users: User[];
    };
