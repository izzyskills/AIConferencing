import { ref, onBeforeUnmount } from "vue";
import { log } from "@/utils/logging";
import { servers } from "@/utils/ICEServers";
import { WS_EVENTS, DESCRIPTION_TYPE } from "@/config";
import { useSocket } from "@/composables/useSocket";

export function useWebRTC(username) {
  const { socket } = useSocket();

  const localStream = ref(null);
  const myVideo = ref(null);

  const constraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
    },
    video: {
      width: 400,
      height: 250,
    },
  };

  const configuration = servers;

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  onBeforeUnmount(() => {
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => track.stop());
    }
  });

  const getUserMedia = async () => {
    log(`Requesting ${username} video stream`);

    if ("mediaDevices" in navigator) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (myVideo.value) {
          myVideo.value.srcObject = stream;
          myVideo.value.volume = 0;
        }
        localStream.value = stream;
        return stream;
      } catch (error) {
        log(`getUserMedia error: ${error}`);
        throw error;
      }
    }
  };

  const setRemoteDescription = async (remoteDesc, pc) => {
    try {
      log(`${username} setRemoteDescription: start`);
      await pc.setRemoteDescription(remoteDesc);
      log(`${username} setRemoteDescription: finished`);
    } catch (error) {
      log(
        `Error setting the RemoteDescription in ${username}. Error: ${error}`,
      );
      throw error;
    }
  };

  const createOffer = async (pc, to, room, conference = false) => {
    log(`${username} wants to start a call with ${to}`);
    try {
      const offer = await pc.createOffer(offerOptions);
      log(`${username} setLocalDescription: start`);
      await pc.setLocalDescription(offer);
      log(`${username} setLocalDescription: finished`);
      sendSignalingMessage(pc.localDescription, true, to, room, conference);
    } catch (error) {
      log(`Error creating the offer from ${username}. Error: ${error}`);
      throw error;
    }
  };

  const createAnswer = async (pc, to, room, conference) => {
    log(`${username} create an answer: start`);
    try {
      const answer = await pc.createAnswer();
      log(`${username} setLocalDescription: start`);
      await pc.setLocalDescription(answer);
      log(`${username} setLocalDescription: finished`);
      sendSignalingMessage(pc.localDescription, false, to, room, conference);
    } catch (error) {
      log(`Error creating the answer from ${username}. Error: ${error}`);
      throw error;
    }
  };

  const handleAnswer = async (desc, pc, from, room, conference = false) => {
    log(`${username} gets an offer from ${from}`);
    await setRemoteDescription(desc, pc);
    await createAnswer(pc, from, room, conference);
  };

  const sendSignalingMessage = (desc, offer, to, room, conference) => {
    const isOffer = offer ? DESCRIPTION_TYPE.offer : DESCRIPTION_TYPE.answer;
    log(
      `${username} sends the ${isOffer} through the signal channel to ${to} in room ${room}`,
    );

    socket.emit(
      conference
        ? WS_EVENTS.PCSignalingConference
        : WS_EVENTS.privateMessagePCSignaling,
      {
        desc,
        to,
        from: username,
        room,
      },
    );
  };

  const addLocalStream = (pc) => {
    if (localStream.value) {
      pc.addStream(localStream.value);
    }
  };

  const addCandidate = async (pc, candidate) => {
    try {
      log(`${username} added a candidate`);
      await pc.addIceCandidate(candidate);
    } catch (error) {
      log(`Error adding a candidate in ${username}. Error: ${error}`);
      throw error;
    }
  };

  const onIceCandidates = (pc, to, room, conference = false) => {
    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      setTimeout(() => {
        socket.emit(
          conference
            ? WS_EVENTS.PCSignalingConference
            : WS_EVENTS.privateMessagePCSignaling,
          {
            candidate,
            to,
            from: username,
            room,
          },
        );
      }, 500);
    };
  };

  const onAddStream = (user, video) => {
    user.pc.onaddstream = (event) => {
      user.peerVideo = user.peerVideo || document.getElementById(video);
      if (!user.peerVideo.srcObject && event.stream) {
        user.peerStream = event.stream;
        user.peerVideo.srcObject = user.peerStream;
      }
    };
  };

  const toggleVideo = () => {
    if (localStream.value) {
      localStream.value
        .getVideoTracks()
        .forEach((t) => (t.enabled = !t.enabled));
    }
  };

  const toggleAudio = () => {
    if (localStream.value) {
      localStream.value
        .getAudioTracks()
        .forEach((t) => (t.enabled = !t.enabled));
    }
  };

  return {
    myVideo,
    localStream,
    getUserMedia,
    setRemoteDescription,
    createOffer,
    createAnswer,
    handleAnswer,
    addLocalStream,
    addCandidate,
    onIceCandidates,
    onAddStream,
    toggleVideo,
    toggleAudio,
  };
}
