<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-vue-next";
import { useVideoConfiguration } from "@/composables/useVideoConfiguration";
import { useAuth } from "@/composables/useauth";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { usePostJoinRoom } from "@/adapters/requests";
import useAudioRecorder from "@/composables/useAudioRecorder";

// Expect a roomId prop (you might also pass userId via auth)
const route = useRoute();
const router = useRouter();
const roomId = route.params.roomId;
// Get the current user from your auth composable
const { error, joinRoom } = usePostJoinRoom();
const redirectTimer = ref(null);
const { getUser } = useAuth();
const userId = getUser.value?.user_uid; // adjust as necessary
const username = getUser.value?.email; // adjust as necessary

// Reference to the local video element
const myVideo = ref(null);

// Use the video configuration composable with the room and user IDs
const {
  localStream,
  remoteStreams,
  usernames,
  initializeMedia,
  setupWebSocket,
  toggleAudio,
  toggleVideo,
  cleanup,
  isAdmin,
} = useVideoConfiguration(roomId, userId, username);

// Initialize the audio recorder composable.
const { startRecording, stopRecording, recordingBlob } = useAudioRecorder(
  localStream,
  isAdmin,
  roomId,
);
console.log(usernames);
// Local UI state for toggles
const localMuted = ref(false);
const localVideoOff = ref(false);

// Compute the participant count (local + remote)
const participantCount = computed(
  () => Object.keys(remoteStreams).length + (localStream.value ? 1 : 0),
);

// Compute a grid class for displaying video elements
const gridClass = computed(() => {
  const count = participantCount.value;
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-2";
  return "grid-cols-3 sm:grid-cols-3";
});

// Method to handle leaving the meeting
function handleLeave() {
  // For example, navigate away or use your router to push a new route
  cleanup();
  if (userId) {
    router.push("/dashboard");
  } else {
    router.push("/");
  }
}

onMounted(async () => {
  try {
    // Attempt to join room first
    await joinRoom.mutateAsync({
      rid: roomId,
      formData: { room_id: roomId, user_id: userId },
    });

    // Only initialize if join was successful
    await nextTick();
    if (myVideo.value) {
      await initializeMedia(myVideo.value);
    }
    setupWebSocket();
    // Start recording if this client is the host.
    if (isAdmin.value) {
      startRecording();
    }
  } catch (err) {
    // Cleanup any partial initialization
    cleanup();
    stopRecording();
    // Set redirect timer
    redirectTimer.value = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
  }
});

onBeforeRouteLeave((to, from, next) => {
  cleanup();
  stopRecording();
  next();
});
onBeforeUnmount(() => {
  // Clean up the WebSocket and peer connections
  cleanup();
  stopRecording();
});
</script>

<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Participant Counter -->
      <div class="mb-4 text-sm text-muted-foreground">
        Participants: {{ participantCount }}/10
      </div>

      <!-- Video Grid -->
      <div class="grid gap-4 mb-4" :class="gridClass">
        <!-- Remote Participants -->
        <div
          v-for="(stream, uid) in remoteStreams"
          :key="uid"
          class="aspect-video bg-muted rounded-lg shadow-md overflow-hidden relative"
        >
          <!-- Use a ref callback to assign the media stream -->
          <video
            :ref="
              (el) => {
                if (el && remoteStreams[uid]) {
                  el.srcObject = remoteStreams[uid];
                }
              }
            "
            style="transform: scaleX(-1)"
            class="w-full h-full object-cover"
            autoplay
            playsinline
          ></video>
          >
          <div
            class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded"
          >
            {{ usernames[uid] }}
            <PhoneOff
              v-if="remoteStreams[uid].ismuted"
              remoteStreams[uid].ismuted
              class="inline-block ml-1 h-4 w-4"
            />
          </div>
        </div>
        <!-- Local Participant -->
        <div
          class="aspect-video bg-muted rounded-lg shadow-md overflow-hidden relative ring-2 ring-primary/50"
        >
          <video
            ref="myVideo"
            style="transform: scaleX(-1)"
            class="w-full h-full object-cover"
            autoplay
            playsinline
            muted
          ></video>
          <div
            class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded"
          >
            {{ `You` }}
            <PhoneOff v-if="localMuted" class="inline-block ml-1 h-4 w-4" />
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4"
      >
        <Button
          :variant="localMuted ? 'destructive' : 'secondary'"
          size="icon"
          @click="
            localMuted = !localMuted;
            toggleAudio();
          "
        >
          <component :is="localMuted ? MicOff : Mic" class="h-4 w-4" />
        </Button>

        <Button
          :variant="localVideoOff ? 'destructive' : 'secondary'"
          size="icon"
          @click="
            localVideoOff = !localVideoOff;
            toggleVideo(myVideo);
          "
        >
          <component :is="localVideoOff ? VideoOff : Video" class="h-4 w-4" />
        </Button>

        <Button variant="destructive" size="icon" @click="handleLeave">
          <PhoneOff class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
