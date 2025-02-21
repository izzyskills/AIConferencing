import { ref, reactive, onBeforeUnmount } from "vue";
import { log } from "@/utils/logging";
import { servers } from "@/utils/ICEServers";
import { config } from "@/config";

export function useVideoConfiguration(roomId, userId, username) {
  // Reactive state
  const localStream = ref(null);
  const remoteStreams = reactive({});
  const peers = reactive({});
  const usernames = reactive({});
  const socket = ref(null);
  const videoStopped = ref(false);
  const audioStopped = ref(false);
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
      `ws://localhost:8000/api/v1/room/ws/${roomId}/${userId}?username=${encodeURIComponent(username)}`,
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
          console.log("username:", message.username);
          if (message.userId !== userId) {
            await initiateCall(message.userId);
          }
          usernames[message.userId] = message.username;
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
    const pc = new RTCPeerConnection({
      iceServers: servers.iceServers,
      iceTransportPolicy: "all", // Try all candidates
      iceCandidatePoolSize: 10,
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
    });

    // Add transceivers with proper directions
    pc.addTransceiver("video", { direction: "sendrecv" });
    pc.addTransceiver("audio", { direction: "sendrecv" });

    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === "complete") {
        // clearTimeout(iceTimeout);
      }
    };

    // Add local tracks if available
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.value);
      });
    }

    // ICE Candidate handling
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

    pc.ontrack = (event) => {
      console.log("ontrack event for", remoteUserId, event);
      // Assuming remoteStreams is defined as a reactive object (e.g., reactive({}))
      remoteStreams[remoteUserId] = event.streams[0];
    }; // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}:`, pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        handleUserLeft(remoteUserId);
      }
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

    const pc = peers[remoteUserId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set for answer");
    }
  }

  async function handleIceCandidate(remoteUserId, candidate) {
    console.log("Received ICE candidate from:", remoteUserId);
    console.log("Candidate details:", candidate);

    const pc = peers[remoteUserId];
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("ICE candidate added");
    }
  }

  async function initiateCall(remoteUserId) {
    try {
      const pc = await createPeerConnection(remoteUserId);

      // Use explicit offer options
      const offer = await pc.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
        iceRestart: true,
      });

      await pc.setLocalDescription(offer);

      // Add SDP validation
      if (!offer.sdp) {
        throw new Error("Invalid SDP generated");
      }
      socket.value.send(
        JSON.stringify({
          type: "offer",
          target: remoteUserId,
          offer: offer,
        }),
      );
    } catch (error) {
      console.error("Offer creation error:", error);
      handleUserLeft(remoteUserId);
    }
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
  async function toggleVideo(videoElement) {
    if (!videoStopped.value) {
      // Video is currently on. Stop video tracks and release the camera.
      if (localStream.value) {
        localStream.value.getVideoTracks().forEach((track) => track.stop());
        // Optionally remove the video track from peer connections:
        Object.values(peers).forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === "video") {
              sender.replaceTrack(null);
            }
          });
        });
        // Optionally, clear the video from the UI.
        if (videoElement) {
          videoElement.srcObject = null;
        }
        videoStopped.value = true;
      }
    } else {
      // Video is currently off. Start a new video stream.
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Here, we assume localStream.value was holding both audio and video.
        // If you're using one stream for both, you might need to merge the new video track
        // with any existing audio tracks. For simplicity, assume the new stream is your new local stream.
        if (localStream.value) {
          const newVideoTrack = newStream.getVideoTracks()[0];
          localStream.value.addTrack(newVideoTrack);
        } else {
          localStream.value = newStream;
        }
        // Update peer connections:

        if (videoElement) {
          videoElement.srcObject = newStream;
        }
        // Update all peer connections with the new video track.
        Object.values(peers).forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (!sender.track || sender.track.kind === "video") {
              // Replace the (null or ended) track with the new video track.
              const newVideoTrack = newStream.getVideoTracks()[0];
              sender.replaceTrack(newVideoTrack);
            }
          });
        });
        videoStopped.value = false;
      } catch (err) {
        console.error("Error restarting video:", err);
      }
    }
  }
  async function toggleAudio() {
    if (!audioStopped.value) {
      // Audio is currently on. Stop audio tracks.
      if (localStream.value) {
        localStream.value.getAudioTracks().forEach((track) => track.stop());
        // Remove audio from peer connections:
        Object.values(peers).forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === "audio") {
              sender.replaceTrack(null);
            }
          });
        });
        audioStopped.value = true;
      }
    } else {
      // Audio is currently off. Restart audio.
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // If you have a combined stream for audio & video, you might need to merge tracks.
        // For now, we assume that for audio we simply update the audio track.
        // If localStream already exists and contains video, you can add the new audio track to it:
        if (localStream.value) {
          const newAudioTrack = newStream.getAudioTracks()[0];
          localStream.value.addTrack(newAudioTrack);
          // Update peer connections:
          Object.values(peers).forEach((pc) => {
            pc.getSenders().forEach((sender) => {
              if (!sender.track || sender.track.kind === "audio") {
                sender.replaceTrack(newAudioTrack);
              }
            });
          });
        } else {
          // Otherwise, if there's no existing local stream, just set it.
          localStream.value = newStream;
        }
        audioStopped.value = false;
      } catch (err) {
        console.error("Error restarting audio:", err);
      }
    }
  }
  // Cleanup on unmount
  function cleanup() {
    // Close all peer connections
    Object.values(peers).forEach((pc) => {
      pc.close();
      pc.ontrack = null;
      pc.onicecandidate = null;
    });

    // Stop all local media tracks
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => track.stop());
      localStream.value = null;
    }

    // Close WebSocket
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }

    // Clear remote streams
    Object.keys(remoteStreams).forEach((key) => {
      delete remoteStreams[key];
    });
  }
  return {
    localStream,
    remoteStreams,
    peers,
    usernames,
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
    toggleVideo,
    toggleAudio,
    cleanup,
  };
}
