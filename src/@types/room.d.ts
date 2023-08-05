import { UUID } from "@/@types/brands";

export type BaseRoom = {
  id: UUID;
  isLt: boolean;
  owner: string;
  users: string[];
  timer?: NodeJS.Timeout;
};

export type UnlistedRoom = BaseRoom & {
  type: "unlisted";
};

export type PrivateRoom = BaseRoom & {
  type: "private";
  allowed: string[];
};

export type Room = UnlistedRoom | PrivateRoom;
