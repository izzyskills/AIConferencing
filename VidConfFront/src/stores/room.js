import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { STATUS_OPTIONS } from "@/config";

export const useRoomStore = defineStore("room", () => {
  const room = ref(undefined);
  const username = ref(undefined);
  const status = ref(STATUS_OPTIONS.available);
  const rooms = ref([]);
  function joinRoom(room_value, username_value) {
    room.value = room_value;
    username.value = username_value;
  }
  function changeRoom(room_value) {
    room.value = room_value;
  }
  function setRooms(rooms_value) {
    rooms.value = rooms_value;
  }
  function leaveChat() {
    room.value = undefined;
    username.value = undefined;
  }
  function changeStatus() {
    let nextStatus;
    if (status.value === STATUS_OPTIONS.available)
      nextStatus = STATUS_OPTIONS.absent;
    if (status.value === STATUS_OPTIONS.absent)
      nextStatus = STATUS_OPTIONS.unavailable;
    if (status.value === STATUS_OPTIONS.unavailable)
      nextStatus = STATUS_OPTIONS.available;

    status.value = nextStatus;
  }

  async function joinRoomAction({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const { body } = await Vue.http.post(`${url}/auth/login`, data);
        if (body.code === 400 || body.code === 401 || body.code === 500) {
          reject({ message: body.message });
        }
        commit(STORE_ACTIONS.joinRoom, data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function changeRoomAction({ commit }, room) {
    commit(STORE_ACTIONS.changeRoom, room);
  }

  async function setRoomsAction({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const rooms = [
          { id: 1, name: "GENERAL" },
          { id: 2, name: "SPORTS" },
          { id: 3, name: "GAMES" },
        ];
        commit(STORE_ACTIONS.setRooms, rooms);
        resolve(rooms);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function leaveChatAction({ commit }, username) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          body: { code },
        } = await Vue.http.post(`${url}/auth/logout`, { username });
        if (code !== 200) reject();
        commit(STORE_ACTIONS.leaveChat);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function changeStatusAction({ commit }) {
    commit(STORE_ACTIONS.changeStatus);
  }

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
    joinRoomAction,
    changeRoomAction,
    setRoomsAction,
    leaveChatAction,
    changeStatusAction,
  };
});
