<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
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
import { useStore } from "vuex";

const props = defineProps({
  conference: Object,
  users: Array,
});

const store = useStore();
const conference = props.conference;

const localMuted = ref(false);
const localVideoOff = ref(false);
const peers = ref({});
const peersLength = ref(0);

const toggleMute = () => {
  localMuted.value = !localMuted.value;
};

const toggleVideo = () => {
  localVideoOff.value = !localVideoOff.value;
};

const addParticipant = () => {
  // Add participant logic
};

const removeParticipant = () => {
  // Remove participant logic
};

const getGridColumns = (count) => {
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-2";
  return "grid-cols-3 sm:grid-cols-3";
};

const initWebRTC = (user, desc) => {
  peers.value[user] = {
    username: user,
    pc: new RTCPeerConnection(videoConfiguration),
    peerStream: undefined,
    peerVideo: undefined,
  };
  addLocalStream(peers.value[user].pc);
  onIceCandidates(peers.value[user].pc, user, conference.room, true);
  onAddStream(peers.value[user], user);

  desc
    ? handleAnswer(desc, peers.value[user].pc, user, conference.room, true)
    : createOffer(peers.value[user].pc, user, conference.room, true);
};

const invite = (user) => {
  $socket.emit(WS_EVENTS.conferenceInvitation, {
    room: store.state.room,
    to: user,
    from: username,
  });
};

onMounted(async () => {
  const myVideo = document.getElementById("localVideo");
  if (conference.admin) {
    await getUserMedia();
    $socket.emit(WS_EVENTS.joinConference, { ...store.state, to: username });
  }
  if (conference.offer) {
    const {
      offer: { from, desc },
    } = conference;
    init(from, desc);
  }
});

onBeforeUnmount(() => {
  Object.values(peers.value).forEach((peer) => peer.pc.close());
  peers.value = {};
  $socket.emit(WS_EVENTS.leaveConference, {
    ...store.state,
    from: username,
    conferenceRoom: conference.room,
  });
});

watch(conference, ({ user, answer, candidate, userLeft, offer }, oldVal) => {
  if (userLeft && userLeft !== oldVal.userLeft) {
    peersLength.value--;
    peers.value[userLeft].pc.close();
    delete peers.value[userLeft];
  }
  if (user && user !== oldVal.user) {
    initWebRTC(user);
    peersLength.value++;
  }
  if (answer && oldVal.answer !== answer) {
    setRemoteDescription(answer.desc, peers.value[answer.from].pc);
  }
  if (candidate && oldVal.candidate !== candidate) {
    addCandidate(peers.value[candidate.from].pc, candidate.candidate);
  }
  if (offer && offer !== oldVal.offer && oldVal.offer !== undefined) {
    const { from, desc } = offer;
    init(from, desc);
  }
});
</script>

<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <div
        :class="`grid ${getGridColumns(Object.keys(peers).length + 1)} gap-4 mb-4`"
      >
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
            id="localVideo"
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
          :disabled="Object.keys(peers).length >= 10"
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
