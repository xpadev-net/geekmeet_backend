import { UUID } from "@/@types/brands";

export type UnlistedRoom = {
  type: "unlisted";
  id: UUID;
  isLt: boolean;
  owner: string;
  users: string[];
};

export type PrivateRoom = {
  type: "private";
  id: UUID;
  isLt: boolean;
  owner: string;
  allowed: string[];
  users: string[];
};

export type Room = UnlistedRoom | PrivateRoom;
