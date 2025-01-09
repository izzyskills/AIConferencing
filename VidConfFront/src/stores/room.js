import { defineStore } from "pinia";
import { ref } from "vue";
import { STATUS_OPTIONS } from "@/config";

export const useRoomStore = defineStore("room", () => {
  // State
  const room = ref(undefined);
  const username = ref(undefined);
  const status = ref(STATUS_OPTIONS.available);
  const rooms = ref([]);
  const conference = ref({
    room: undefined,
    admin: false,
    offer: null,
    answer: null,
    candidate: null,
    user: null,
    userLeft: null,
  });

  // Actions
  const setRooms = (newRooms) => {
    rooms.value = newRooms;
  };

  const updateConference = (update) => {
    conference.value = {
      ...conference.value,
      ...update,
    };
  };

  const joinRoom = async (data) => {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (body.code === 400 || body.code === 401 || body.code === 500) {
        throw new Error(body.message);
      }

      room.value = data.room;
      username.value = data.username;
    } catch (error) {
      throw error;
    }
  };

  const changeRoom = (newRoom) => {
    room.value = newRoom;
  };

  const leaveChat = () => {
    room.value = undefined;
    username.value = undefined;
    conference.value = {
      room: undefined,
      admin: false,
      offer: null,
      answer: null,
      candidate: null,
      user: null,
      userLeft: null,
    };
  };

  const changeStatus = () => {
    const statusMap = {
      [STATUS_OPTIONS.available]: STATUS_OPTIONS.absent,
      [STATUS_OPTIONS.absent]: STATUS_OPTIONS.unavailable,
      [STATUS_OPTIONS.unavailable]: STATUS_OPTIONS.available,
    };
    status.value = statusMap[status.value];
  };

  return {
    // State
    room,
    username,
    status,
    rooms,
    conference,
    // Actions
    setRooms,
    updateConference,
    joinRoom,
    changeRoom,
    leaveChat,
    changeStatus,
  };
});
