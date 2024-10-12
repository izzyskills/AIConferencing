<script setup>
import { XCircleIcon } from "lucide-vue-next";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { defineProps } from "vue";

const props = defineProps({
  email: { type: String, required: true },
  role: { type: String, required: false },
  removeParticipant: { type: Function, required: false },
});
</script>
<template>
  <div class="relative group">
    <div class="flex items-center justify-between space-x-4">
      <div class="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{{
            email.substring(0, 2).toUpperCase()
          }}</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm text-muted-foreground">{{ email }}</p>
        </div>
      </div>
      <Button disabled variant="outline">{{ role || `Participant` }}</Button>
    </div>
    <XCircleIcon
      v-if="removeParticipant"
      class="absolute -top-5 -right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-6 h-6 text-primary"
      @click="removeParticipant(email)"
    />
  </div>
</template>
