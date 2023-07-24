import { UUID } from "@/@types/brands";

export type UnlistedRoom = {
  type: "unlisted";
  id: UUID;
  owner: string;
  users: string[];
};

export type PrivateRoom = {
  type: "private";
  id: UUID;
  owner: string;
  allowed: string[];
  users: string[];
};

export type Room = UnlistedRoom | PrivateRoom;
