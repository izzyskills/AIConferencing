import { ref, reactive, onBeforeUnmount } from "vue";
import { log } from "@/utils/logging";
import { servers } from "@/utils/ICEServers";
import { config } from "@/config";

export function useVideoConfiguration(roomId, userId) {
  // Reactive state
  const localStream = ref(null);
  const remoteStreams = reactive({});
  const peers = reactive({});
  const socket = ref(null);
  const constraints = {
    audio: { echoCancellation: true, noiseSuppression: true },
    video: { width: 400, height: 250 },
  };

  // Initialize media and assign stream to the provided video element
  async function initializeMedia(videoElement) {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoElement) {
        videoElement.srcObject = localStream.value; // ✅ Explicitly assign stream
      }
    } catch (error) {
      console.error("Media error:", error);
    }
  }
  // Set up the WebSocket connection using the room and user IDs
  function setupWebSocket() {
    socket.value = new WebSocket(
      `ws://localhost:8000/api/v1/room/ws/${roomId}/${userId}`,
    );

    socket.value.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      switch (message.type) {
        case "offer":
          await handleOffer(message.sender, message.offer);
          break;
        case "answer":
          await handleAnswer(message.sender, message.answer);
          break;
        case "ice-candidate":
          await handleIceCandidate(message.sender, message.candidate);
          break;
        case "user-joined":
          // When another user joins, initiate a call to that user.
          console.log("User joined:", message.userId);
          if (message.userId !== userId) {
            await initiateCall(message.userId);
          }
          break;
        case "user-left":
          handleUserLeft(message.userId);
          break;
        default:
          // handle other events if necessary
          break;
      }
    };

    socket.value.onopen = () => {
      log("WebSocket connection established");
    };

    socket.value.onerror = (err) => {
      log(`WebSocket error: ${err}`);
    };

    socket.value.onclose = () => {
      log("WebSocket connection closed");
    };
  }

  // Create a peer connection for a remote user
  async function createPeerConnection(remoteUserId) {
    const pc = new RTCPeerConnection({ iceServers: servers.iceServers });

    // Add local stream tracks
    localStream.value.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.value);
    });

    // Handle ICE candidates
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.value.send(
          JSON.stringify({
            type: "ice-candidate",
            target: remoteUserId,
            candidate: candidate.toJSON(),
          }),
        );
      }
    };

    // When a remote stream is received, store it in reactive remoteStreams
    pc.ontrack = (event) => {
      remoteStreams[remoteUserId] = event.streams[0];
    };

    peers[remoteUserId] = pc;
    return pc;
  }

  async function handleOffer(remoteUserId, offer) {
    console.log("Received offer from:", remoteUserId);
    console.log("Offer details:", offer);

    const pc = await createPeerConnection(remoteUserId);
    console.log("PC created for:", remoteUserId);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("Remote description set");

    const answer = await pc.createAnswer();
    console.log("Answer created:", answer);

    await pc.setLocalDescription(answer);
    console.log("Local description set");

    socket.value.send(
      JSON.stringify({
        type: "answer",
        target: remoteUserId,
        answer: answer,
      }),
    );
    console.log("Answer sent to:", remoteUserId);
  }

  async function handleAnswer(remoteUserId, answer) {
    console.log("Received answer from:", remoteUserId);
    console.log("Answer details:", answer);

    const pc = peers.value[remoteUserId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set for answer");
    }
  }

  async function handleIceCandidate(remoteUserId, candidate) {
    onsole.log("Received ICE candidate from:", remoteUserId);
    console.log("Candidate details:", candidate);

    const pc = peers.value[remoteUserId];
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("ICE candidate added");
    }
  }

  async function initiateCall(remoteUserId) {
    console.log("Initiating call to:", remoteUserId);
    const pc = await createPeerConnection(remoteUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.value.send(
      JSON.stringify({
        type: "offer",
        target: remoteUserId,
        offer: offer,
      }),
    );
  }

  function handleUserJoined(remoteUserId) {
    if (remoteUserId !== userId) {
      initiateCall(remoteUserId);
    }
  }

  function handleUserLeft(remoteUserId) {
    if (peers[remoteUserId]) {
      peers[remoteUserId].close();
      delete peers[remoteUserId];
      delete remoteStreams[remoteUserId];
    }
  }

  // Toggle local video and audio tracks
  function pauseVideo() {
    localStream.value?.getVideoTracks().forEach((track) => {
      track.stop(); // ✅ Toggle actual camera usage
    });
  }
  function pauseAudio() {
    localStream.value &&
      localStream.value.getAudioTracks().forEach((t) => t.stop()); // ✅ Toggle actual microphone usage
  }

  // Cleanup on unmount
  function cleanup() {
    socket.value?.close();
    Object.values(peers).forEach((pc) => pc.close());
  }

  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    localStream,
    remoteStreams,
    peers,
    socket,
    initializeMedia,
    setupWebSocket,
    createPeerConnection,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    initiateCall,
    handleUserJoined,
    handleUserLeft,
    pauseVideo,
    pauseAudio,
    cleanup,
  };
}
