import { storeToRefs } from "pinia";
import { useRoomStore } from "@/stores/room";

export function useRoom() {
  const roomStore = useRoomStore();

  const { room, username, status, rooms } = storeToRefs(roomStore);
  const { joinRoom, changeRoom, setRooms, leaveChat, changeStatus } = roomStore;

  return {
    room,
    username,
    status,
    rooms,
    joinRoom,
    changeRoom,
    setRooms,
    leaveChat,
    changeStatus,
  };
}
