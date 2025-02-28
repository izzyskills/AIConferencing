import React, { useState } from "react";
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

const JoinMeetingForm = () => {
  const [joinType, setJoinType] = useState("link");
  const [joinInput, setJoinInput] = useState("");

  const handleJoinMeeting = () => {
    // Handle the join meeting logic here
    console.log(`Joining meeting with ${joinType}: ${joinInput}`);
  };

  return (
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
        <RadioGroup value={joinType} onChange={setJoinType}>
          <RadioGroupItem value="link">
            <Label>Join with Link</Label>
          </RadioGroupItem>
          <RadioGroupItem value="id">
            <Label>Join with ID</Label>
          </RadioGroupItem>
        </RadioGroup>
        <Input
          value={joinInput}
          onChange={(e) => setJoinInput(e.target.value)}
          placeholder="Enter link or ID"
        />
        <DialogFooter>
          <Button onClick={handleJoinMeeting}>Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinMeetingForm;
