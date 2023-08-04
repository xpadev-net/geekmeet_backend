import { Room } from "@/@types/room";
import { UUID } from "@/@types/brands";

export const rooms: { [roomId: UUID]: Room } = {
  ["test" as UUID]: {
    type: "unlisted",
    id: "test" as UUID,
    isLt: false,
    owner: "",
    users: [],
  },
};
