export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  IS_DEMO: Boolean(import.meta.env.VITE_IS_DEMO),
};

export const url = `${import.meta.env.VUE_APP_SOCKET_HOST || "http://localhost"}:${import.meta.env.VUE_APP_SOCKET_PORT || "3000"}`;

export const STORE_ACTIONS = {
  joinRoom: "joinRoom",
  setRooms: "setRooms",
  changeRoom: "changeRoom",
  leaveChat: "leaveChat",
  changeStatus: "changeStatus",
};
export const WS_EVENTS = {
  joinPrivateRoom: "joinPrivateRoom",
  joinRoom: "joinRoom",
  leaveRoom: "leaveRoom",
  publicMessage: "publicMessage",
  leavePrivateRoom: "leavePrivateRoom",
  leaveChat: "leaveChat",
  changeStatus: "changeStatus",
  privateMessage: "privateMessage",
  privateMessagePCSignaling: "privateMessagePCSignaling",
  PCSignalingConference: "PCSignalingConference",
  conferenceInvitation: "conferenceInvitation",
  joinConference: "joinConference",
  leaveConference: "leaveConference",
};

export const STATUS_OPTIONS = {
  available: "available",
  absent: "absent",
  unavailable: "unavailable",
};

export const DESCRIPTION_TYPE = {
  offer: "offer",
  answer: "answer",
};
