<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  UserPlus,
  UserMinus,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { WS_EVENTS } from "@/config";
import { videoConfiguration } from "@/mixins/WebRTC";
import { useWebRTC } from "@/composables/useWebRTC";
import { useSocket } from "@/composables/useSocket";
import { useRoom } from "@/composables/useRoom";

const props = defineProps({
  conference: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    default: () => [],
  },
});

// Store setup
const { room, username } = useRoom();

// Socket setup
const { socket } = useSocket();

// Local state
const localMuted = ref(false);
const localVideoOff = ref(false);
const peers = ref({});
const peersLength = ref(0);

// WebRTC setup
const {
  myVideo,
  getUserMedia,
  addLocalStream,
  onIceCandidates,
  onAddStream,
  handleAnswer,
  createOffer,
  setRemoteDescription,
  addCandidate,
  toggleVideo: toggleVideoStream,
  toggleAudio: toggleAudioStream,
} = useWebRTC(username.value);

// Computed
const gridColumns = computed(() => {
  const count = peersLength.value;
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-2";
  return "grid-cols-3 sm:grid-cols-3";
});

// Methods
const toggleMute = () => {
  localMuted.value = !localMuted.value;
  toggleAudioStream();
};

const toggleVideo = () => {
  localVideoOff.value = !localVideoOff.value;
  toggleVideoStream();
};

const initWebRTC = (user, desc) => {
  peers.value[user] = {
    username: user,
    pc: new RTCPeerConnection(videoConfiguration),
    peerStream: undefined,
    peerVideo: undefined,
  };

  addLocalStream(peers.value[user].pc);
  onIceCandidates(peers.value[user].pc, user, props.conference.room, true);
  onAddStream(peers.value[user], user);

  desc
    ? handleAnswer(
        desc,
        peers.value[user].pc,
        user,
        props.conference.room,
        true,
      )
    : createOffer(peers.value[user].pc, user, props.conference.room, true);
};

const invite = (user) => {
  socket.emit(WS_EVENTS.conferenceInvitation, {
    room: room.value,
    to: user,
    from: username.value,
  });
};

// Lifecycle hooks
onMounted(async () => {
  if (props.conference.admin) {
    await getUserMedia();
    socket.emit(WS_EVENTS.joinConference, {
      room: room.value,
      username: username.value,
      to: username.value,
    });
  }

  if (props.conference.offer) {
    const {
      offer: { from, desc },
    } = props.conference;
    initWebRTC(from, desc);
  }
});

onBeforeUnmount(() => {
  Object.values(peers.value).forEach((peer) => peer.pc.close());
  peers.value = {};
  socket.emit(WS_EVENTS.leaveConference, {
    room: room.value,
    username: username.value,
    from: username.value,
    conferenceRoom: props.conference.room,
  });
});

// Watch
watch(
  () => props.conference,
  (newVal, oldVal) => {
    const { user, answer, candidate, userLeft, offer } = newVal;

    if (userLeft && userLeft !== oldVal?.userLeft) {
      peersLength.value--;
      peers.value[userLeft].pc.close();
      delete peers.value[userLeft];
    }

    if (user && user !== oldVal?.user) {
      initWebRTC(user);
      peersLength.value++;
    }

    if (answer && oldVal?.answer !== answer) {
      setRemoteDescription(answer.desc, peers.value[answer.from].pc);
    }

    if (candidate && oldVal?.candidate !== candidate) {
      addCandidate(peers.value[candidate.from].pc, candidate.candidate);
    }

    if (offer && offer !== oldVal?.offer && oldVal?.offer !== undefined) {
      const { from, desc } = offer;
      initWebRTC(from, desc);
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Add participant counter -->
      <div class="mb-4 text-sm text-muted-foreground">
        Participants: {{ Object.keys(peers).length }}/{{
          CONFERENCE_LIMITS.MAX_PEERS
        }}
      </div>
      <div :class="['grid gap-4 mb-4', gridColumns]">
        <div
          v-for="(peer, key) in peers"
          :key="key"
          class="aspect-video bg-muted rounded-lg shadow-md overflow-hidden relative"
        >
          <video
            :id="key"
            class="w-full h-full object-cover"
            autoplay
            playsinline
          ></video>
        </div>
        <div
          class="aspect-video bg-muted rounded-lg shadow-md overflow-hidden relative ring-2 ring-primary/50"
        >
          <video
            ref="myVideo"
            class="w-full h-full object-cover"
            autoplay
            playsinline
            muted
          ></video>
        </div>
      </div>
      <div
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4 mb-4"
      >
        <Button
          :variant="localMuted ? 'destructive' : 'secondary'"
          size="icon"
          @click="toggleMute"
        >
          <MicOff v-if="localMuted" class="h-4 w-4" />
          <Mic v-else class="h-4 w-4" />
        </Button>
        <Button
          :variant="localVideoOff ? 'destructive' : 'secondary'"
          size="icon"
          @click="toggleVideo"
        >
          <VideoOff v-if="localVideoOff" class="h-4 w-4" />
          <Video v-else class="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon">
          <PhoneOff class="h-4 w-4" />
        </Button>
      </div>
      <div class="flex justify-center space-x-4">
        <Button
          variant="outline"
          @click="addParticipant"
          :disabled="isAtCapacity"
        >
          <UserPlus class="h-4 w-4 mr-2" />
          Add Participant
        </Button>
        <Button
          variant="outline"
          @click="removeParticipant"
          :disabled="Object.keys(peers).length <= 1"
        >
          <UserMinus class="h-4 w-4 mr-2" />
          Remove Participant
        </Button>
      </div>
    </div>
  </div>
</template>
