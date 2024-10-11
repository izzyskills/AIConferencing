<script setup>
import { XCircleIcon } from "lucide-vue-next";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { defineProps } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  email: { type: String, required: true },
  imagelink: { type: String, required: true },
});
</script>
<template>
  <div class="relative group">
    <div class="flex items-center justify-between space-x-4">
      <div class="flex items-center space-x-4">
        <Avatar>
          <AvatarImage :src="imagelink" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium leading-none">{{ name }}</p>
          <p class="text-sm text-muted-foreground">{{ email }}</p>
        </div>
      </div>
      <Button disabled variant="outline">Participant</Button>
    </div>
    <XCircleIcon
      class="absolute -top-5 -right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-6 h-6 text-primary"
    />
  </div>
</template>
