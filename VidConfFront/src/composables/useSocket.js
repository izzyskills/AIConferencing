import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import { url, WS_EVENTS } from "@/config";
import { log } from "@/utils/logging";
import { useRoomStore } from "@/stores/room";

let socketInstance = null;

export function useSocket() {
  const store = useRoomStore();
  const isConnected = ref(false);
  const error = ref(null);

  const initSocket = () => {
    if (!socketInstance) {
      socketInstance = io(url, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Connection events
      socketInstance.on("connect", () => {
        isConnected.value = true;
        error.value = null;
        log("Socket connected");
      });

      socketInstance.on("disconnect", (reason) => {
        isConnected.value = false;
        log(`Socket disconnected: ${reason}`);
      });

      socketInstance.on("connect_error", (err) => {
        error.value = err;
        log(`Socket connection error: ${err.message}`);
      });

      // Chat events
      socketInstance.on(WS_EVENTS.joinRoom, (data) => {
        store.setRooms(data.rooms);
      });

      socketInstance.on(WS_EVENTS.leaveRoom, (data) => {
        store.setRooms(data.rooms);
      });

      // Conference events
      socketInstance.on(WS_EVENTS.PCSignalingConference, (data) => {
        if (data.desc) {
          if (data.desc.type === "offer") {
            store.updateConference({
              offer: { from: data.from, desc: data.desc },
            });
          } else {
            store.updateConference({
              answer: { from: data.from, desc: data.desc },
            });
          }
        } else if (data.candidate) {
          store.updateConference({
            candidate: { from: data.from, candidate: data.candidate },
          });
        }
      });

      socketInstance.on(WS_EVENTS.joinConference, (data) => {
        store.updateConference({ user: data.from });
      });

      socketInstance.on(WS_EVENTS.leaveConference, (data) => {
        store.updateConference({ userLeft: data.from });
      });

      socketInstance.on(WS_EVENTS.conferenceInvitation, (data) => {
        // Handle conference invitation - could emit an event or update store
        log(
          `Conference invitation received from ${data.from} for room ${data.room}`,
        );
      });
    }

    return socketInstance;
  };

  const emit = (event, data) => {
    if (socketInstance && isConnected.value) {
      socketInstance.emit(event, data);
    } else {
      log("Socket not connected. Cannot emit event.");
    }
  };

  const on = (event, callback) => {
    if (socketInstance) {
      socketInstance.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketInstance) {
      socketInstance.off(event, callback);
    }
  };

  onMounted(() => {
    initSocket();
  });

  onUnmounted(() => {
    if (socketInstance) {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      Object.values(WS_EVENTS).forEach((event) => {
        socketInstance.off(event);
      });
    }
  });

  return {
    socket: socketInstance,
    isConnected,
    error,
    emit,
    on,
    off,
  };
}
