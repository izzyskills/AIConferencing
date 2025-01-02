<script setup>
import { ref } from "vue";
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

const participants = ref([
  { id: 1, name: "You", isMuted: false, isVideoOff: false, isLocal: true },
]);

const localMuted = ref(false);
const localVideoOff = ref(false);

const toggleMute = () => {
  localMuted.value = !localMuted.value;
  updateLocalParticipant("isMuted", localMuted.value);
};

const toggleVideo = () => {
  localVideoOff.value = !localVideoOff.value;
  updateLocalParticipant("isVideoOff", localVideoOff.value);
};

const updateLocalParticipant = (key, value) => {
  participants.value = participants.value.map((p) =>
    p.isLocal ? { ...p, [key]: value } : p,
  );
};

const addParticipant = () => {
  if (participants.value.length < 10) {
    participants.value.push({
      id: participants.value.length + 1,
      name: `User ${participants.value.length + 1}`,
      isMuted: false,
      isVideoOff: false,
      isLocal: false,
    });
  }
};

const removeParticipant = () => {
  if (participants.value.length > 1) {
    participants.value.pop();
  }
};

const getGridColumns = (count) => {
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-2";
  return "grid-cols-3 sm:grid-cols-3";
};
</script>
<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <div :class="`grid ${getGridColumns(participants.length)} gap-4 mb-4`">
        <div
          v-for="participant in participants"
          :key="participant.id"
          :class="`aspect-video bg-muted rounded-lg shadow-md overflow-hidden relative ${participant.isLocal ? 'ring-2 ring-primary/50' : ''}`"
        >
          <div
            v-if="participant.isVideoOff"
            class="absolute inset-0 flex items-center justify-center bg-muted/95"
          >
            <span class="text-2xl font-bold text-muted-foreground">{{
              participant.name[0]
            }}</span>
          </div>
          <img
            v-else
            :src="`/placeholder.svg?height=180&width=320&text=${participant.name}`"
            :alt="participant.name"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
          >
            {{ participant.name }}
            <MicOff
              v-if="participant.isMuted"
              class="inline-block ml-1 w-3 h-3"
            />
          </div>
          <div
            v-if="participant.isLocal"
            class="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded"
          >
            You
          </div>
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
          :disabled="participants.length >= 10"
        >
          <UserPlus class="h-4 w-4 mr-2" />
          Add Participant
        </Button>
        <Button
          variant="outline"
          @click="removeParticipant"
          :disabled="participants.length <= 1"
        >
          <UserMinus class="h-4 w-4 mr-2" />
          Remove Participant
        </Button>
      </div>
    </div>
  </div>
</template>
