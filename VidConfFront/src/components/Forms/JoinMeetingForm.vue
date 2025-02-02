<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const joinType = ref("link");
const joinInput = ref("");

const handleJoinMeeting = () => {
  // Handle the join meeting logic here
  console.log(`Joining meeting with ${joinType.value}: ${joinInput.value}`);
};
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="secondary">Join Meeting</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Join a Meeting</DialogTitle>
        <DialogDescription>
          Select how you want to join the meeting and provide the necessary
          information.
        </DialogDescription>
      </DialogHeader>
      <RadioGroup v-model="joinType">
        <RadioGroupItem value="link">
          <Label>Join with Link</Label>
        </RadioGroupItem>
        <RadioGroupItem value="id">
          <Label>Join with ID</Label>
        </RadioGroupItem>
      </RadioGroup>
      <Input v-model="joinInput" placeholder="Enter link or ID" />
      <DialogFooter>
        <Button @click="handleJoinMeeting">Join</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
