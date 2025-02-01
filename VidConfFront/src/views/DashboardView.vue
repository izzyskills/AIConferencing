<script setup>
import { ref, computed } from "vue";
import { format, parseISO, isAfter, formatDistanceToNow } from "date-fns";
import { CalendarPlus, Users, Lock, Unlock } from "lucide-vue-next";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const ITEMS_PER_PAGE = 5;

const meetings = ref([
  {
    id: "1",
    name: "Team Sync",
    date: "2025-01-01T10:00:00",
    host: "You",
    isPrivate: false,
    attendees: 5,
  },
  {
    id: "2",
    name: "Project Review",
    date: "2025-02-01T14:00:00",
    host: "Alice",
    isPrivate: true,
    attendees: 3,
  },
  {
    id: "3",
    name: "Client Meeting",
    date: "2025-02-02T09:00:00",
    host: "You",
    isPrivate: true,
    attendees: 2,
  },
  {
    id: "4",
    name: "Weekly Standup",
    date: "2025-02-03T11:00:00",
    host: "Bob",
    isPrivate: false,
    attendees: 8,
  },
  {
    id: "5",
    name: "Product Demo",
    date: "2025-02-04T15:00:00",
    host: "You",
    isPrivate: false,
    attendees: 10,
  },
  {
    id: "6",
    name: "Strategy Planning",
    date: "2025-02-05T13:00:00",
    host: "Charlie",
    isPrivate: true,
    attendees: 4,
  },
  {
    id: "7",
    name: "Design Review",
    date: "2025-02-06T10:30:00",
    host: "You",
    isPrivate: false,
    attendees: 6,
  },
]);

const currentPage = ref(1);
const filterHost = ref("all");
const filterPrivacy = ref("all");
const searchTerm = ref("");

const filteredMeetings = computed(() => {
  return meetings.value
    .filter(
      (meeting) =>
        filterHost.value === "all" ||
        (filterHost.value === "you" && meeting.host === "You") ||
        (filterHost.value === "others" && meeting.host !== "You"),
    )
    .filter(
      (meeting) =>
        filterPrivacy.value === "all" ||
        (filterPrivacy.value === "private" && meeting.isPrivate) ||
        (filterPrivacy.value === "public" && !meeting.isPrivate),
    )
    .filter((meeting) =>
      meeting.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const totalPages = computed(() =>
  Math.ceil(filteredMeetings.value.length / ITEMS_PER_PAGE),
);
const paginatedMeetings = computed(() =>
  filteredMeetings.value.slice(
    (currentPage.value - 1) * ITEMS_PER_PAGE,
    currentPage.value * ITEMS_PER_PAGE,
  ),
);

const activeMeeting = computed(() =>
  filteredMeetings.value.find((meeting) =>
    isAfter(new Date(), parseISO(meeting.date)),
  ),
);

const setCurrentPage = (page) => {
  currentPage.value = page;
};
</script>
<template>
  <div class="container mx-auto p-4">
    <div
      v-if="activeMeeting"
      class="fixed top-0 left-0 right-0 bg-primary/20 bg-opacity-75 p-4 z-50"
    >
      <Card class="mb-4">
        <CardHeader class="felx flex-row justify-between">
          <CardTitle class="text-base"
            ><span class="text-2xl">{{ activeMeeting.name }} </span> started
            {{ formatDistanceToNow(parseISO(activeMeeting.date)) }} ago
            <br />
            <span class="text-sm text-primary/60">
              {{ activeMeeting.attendees }} are present
            </span>
          </CardTitle>
          <Button class="ml-auto">Join Now</Button>
        </CardHeader>
      </Card>
    </div>

    <h1 class="text-2xl font-bold mb-4">Meeting Dashboard</h1>

    <div class="flex justify-between items-center mb-4">
      <ScheduledMeetingForm />
      <div class="flex gap-2">
        <Input
          placeholder="Search meetings..."
          v-model="searchTerm"
          class="w-64"
        />
        <Select v-model="filterHost">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by host" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hosts</SelectItem>
            <SelectItem value="you">Your Meetings</SelectItem>
            <SelectItem value="others">Others' Meetings</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="filterPrivacy">
          <SelectTrigger class="w-[180px]">
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

    <Card v-for="meeting in paginatedMeetings" :key="meeting.id" class="mb-4">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <span>{{ meeting.name }}</span>
          <Badge :variant="meeting.isPrivate ? 'secondary' : 'outline'">
            <Lock v-if="meeting.isPrivate" class="h-3 w-3 mr-1" />
            <Unlock v-else class="h-3 w-3 mr-1" />
            {{ meeting.isPrivate ? "Private" : "Public" }}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {{ format(parseISO(meeting.date), "MMMM d, yyyy HH:mm") }}</p>
        <p>Host: {{ meeting.host }}</p>
        <p>
          <Users class="inline mr-2 h-4 w-4" />
          {{ meeting.attendees }} attendees
        </p>
      </CardContent>
    </Card>

    <Pagination
      v-slot="{ page }"
      :total="filteredMeetings.length"
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
