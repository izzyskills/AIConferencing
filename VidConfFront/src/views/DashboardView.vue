<script setup>
import { ref, computed } from "vue";
import { format, parseISO, isAfter, formatDistanceToNow } from "date-fns";
import { CalendarPlus, Users, Lock, Unlock, XCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import ScheduledMeetingForm from "@/components/Forms/ScheduledMeetingForm.vue";
import { useGetRooms } from "@/adapters/requests";
import { useAuth } from "@/composables/useauth";
import JoinMeetingForm from "@/components/Forms/JoinMeetingForm.vue";

const ITEMS_PER_PAGE = 5;
const { error, getRooms } = useGetRooms();
const { getUser } = useAuth();
const dismissedMeetings = ref(new Set());
const currentPage = ref(1);
const filterHost = ref("all");
const filterPrivacy = ref("all");
const searchTerm = ref("");

const filteredMeetings = computed(() => {
  return getRooms.data?.value
    ?.filter((meeting) => isAfter(parseISO(meeting.opens_at), new Date()))
    .filter(
      (meeting) =>
        filterHost.value === "all" ||
        (filterHost.value === "you" &&
          meeting.created_by === getUser.value?.user_uid) ||
        (filterHost.value === "others" &&
          meeting.created_by !== getUser.value?.user_uid),
    )
    .filter(
      (meeting) =>
        filterPrivacy.value === "all" ||
        (filterPrivacy.value === "private" && meeting.public) ||
        (filterPrivacy.value === "public" && !meeting.public),
    )
    .filter((meeting) =>
      meeting.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
    .sort(
      (a, b) => new Date(a.opens_at).getTime() - new Date(b.opens_at).getTime(),
    );
});

const totalPages = computed(() =>
  Math.ceil(filteredMeetings.value?.length / ITEMS_PER_PAGE),
);
const paginatedMeetings = computed(() =>
  filteredMeetings?.value?.slice(
    (currentPage.value - 1) * ITEMS_PER_PAGE,
    currentPage.value * ITEMS_PER_PAGE,
  ),
);

const activeMeetings = computed(() =>
  getRooms.data?.value?.filter(
    (meeting) =>
      isAfter(new Date(), parseISO(meeting.opens_at)) &&
      !dismissedMeetings.value.has(meeting.rid),
  ),
);

const setCurrentPage = (page) => {
  currentPage.value = page;
};

const closeMeeting = (rid) => {
  dismissedMeetings.value.add(rid);
};
</script>
<template>
  <div class="container mx-auto p-4">
    <div
      v-if="activeMeetings?.length"
      class="fixed top-0 left-0 right-0 bg-primary/20 bg-opacity-75 p-4 z-50"
    >
      <div
        v-for="meeting in activeMeetings"
        :key="meeting.rid"
        class="mb-4 relative"
      >
        <Card>
          <CardHeader class="flex flex-row justify-between">
            <CardTitle class="text-base">
              <span class="text-2xl">{{ meeting.name }} </span> started
              {{ formatDistanceToNow(parseISO(meeting.opens_at)) }} ago
              <br />
              <span class="text-sm text-primary/60">
                {{ meeting.attendees }} are present
              </span>
            </CardTitle>
            <RouterLink :to="`/room/${meeting.rid}`">
              <Button class="ml-auto">Join Now</Button>
            </RouterLink>
          </CardHeader>
          <XCircle
            @click="closeMeeting(meeting.rid)"
            class="absolute top-0 right-0 h-6 w-6 hover:stroke-destructive cursor-pointer"
          />
        </Card>
      </div>
    </div>

    <h1 class="text-2xl font-bold mb-4">Meeting Dashboard</h1>

    <div class="flex justify-between items-center mb-4">
      <div
        class="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-x-2 lg:space-y-0"
      >
        <ScheduledMeetingForm />
        <JoinMeetingForm />
      </div>
      <div class="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Search meetings..."
          v-model="searchTerm"
          class="w-40 lg:w-56"
        />
        <Select v-model="filterHost">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Filter by host" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hosts</SelectItem>
            <SelectItem value="you">Your Meetings</SelectItem>
            <SelectItem value="others">Others' Meetings</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="filterPrivacy">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Filter by privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meetings</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div
      v-if="paginatedMeetings?.length === 0"
      class="text-center text-6xl text-primary/60 mt-20"
    >
      You have no scheduled meetings
    </div>
    <Card v-for="meeting in paginatedMeetings" :key="meeting.id" class="mb-4">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <span>{{ meeting.name }}</span>
          <Badge :variant="meeting.public ? 'secondary' : 'outline'">
            <Lock v-if="meeting.public" class="h-3 w-3 mr-1" />
            <Unlock v-else class="h-3 w-3 mr-1" />
            {{ meeting.public ? "Private" : "Public" }}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Date: {{ format(parseISO(meeting.opens_at), "MMMM d, yyyy HH:mm") }}
        </p>
        <p>Host: {{ meeting.created_by }}</p>
        <p>
          <Users class="inline mr-2 h-4 w-4" />
          {{ meeting.attendees }} known attendees
        </p>
      </CardContent>
    </Card>

    <Pagination
      v-if="filteredMeetings?.length > ITEMS_PER_PAGE"
      v-slot="{ page }"
      :total="filteredMeetings?.length"
      :sibling-count="1"
      :items-per-page="ITEMS_PER_PAGE"
      show-edges
      :default-page="currentPage"
      class="flex justify-center mx-auto"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst @click="setCurrentPage(1)" />
        <PaginationPrev
          @click="setCurrentPage(Math.max(1, currentPage - 1))"
          :disabled="currentPage === 1"
        />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <Button
              class="w-10 h-10 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
              @click="setCurrentPage(item.value)"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext
          @click="setCurrentPage(Math.min(totalPages, currentPage + 1))"
          :disabled="currentPage === totalPages"
        />
        <PaginationLast @click="setCurrentPage(totalPages)" />
      </PaginationList>
    </Pagination>
  </div>
</template>
