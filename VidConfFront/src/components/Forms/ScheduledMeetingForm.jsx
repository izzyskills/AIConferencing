import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { meeting_schema } from "./schemas";
import { useCreateRoom } from "@/adapters/Requests";
import { Separator } from "@/components/ui/separator";
import AddParticipant from "../cards/AddParticPant";
import { CalendarPlus } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const ScheduledMeetingForm = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [participants, setParticipants] = useState([user?.email || ""]);
  const [currentParticipant, setCurrentParticipant] = useState("");
  const [participantError, setParticipantError] = useState("");

  const createRoom = useCreateRoom();

  // Initialize form with React Hook Form
  const form = useForm({
    resolver: zodResolver(meeting_schema),
    defaultValues: {
      name: "",
      capacity: 2,
      opens_at: new Date().toISOString().slice(0, 16),
      public: false,
    },
  });

  const participantSchema = z.string().email("Invalid email address");

  const addParticipant = () => {
    const email = currentParticipant;
    const validation = participantSchema.safeParse(email);

    if (!validation.success) {
      setParticipantError(validation.error.errors[0].message);
      return;
    }

    if (participants.includes(email) || email === user?.email) {
      setParticipantError("Email is already added or is your own email");
      return;
    }

    setParticipants([...participants, email]);
    setCurrentParticipant("");
    setParticipantError("");
  };

  const removeParticipant = (participant) => {
    setParticipants(participants.filter((p) => p !== participant));
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const created_by = user.user_uid;
      values.created_by = created_by;
      values.members = participants;
      if (new Date(values.opens_at) <= new Date()) {
        values.in_session = true;
      }
      values.public = !!values.public;
      console.log(values);
      await createRoom.mutateAsync(values);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPublic = form.watch("public");

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" /> Create Meeting
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`w-auto ${isPublic ? "md:min-w-[50rem]" : ""}`}
        >
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl">Create a Meeting</DialogTitle>
            <DialogDescription>
              note meetings only last for an hour
            </DialogDescription>
          </DialogHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <div className={isPublic ? "grid md:grid-cols-2 gap-2" : ""}>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name for meeting"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="opens_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Date</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="public"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Make Meeting Private</FormLabel>
                            <FormDescription>
                              this will only allow invited participants to join
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  {isPublic && (
                    <div className="md:mt-8">
                      <Separator className="md:hidden my-4" />
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">
                            People with access
                          </h4>
                          <h6 className="text-xs font-light text-muted-foreground">
                            Must be at least 2 participants
                          </h6>
                        </div>
                        <div className="grid gap-6">
                          {participants.map((participant, index) => (
                            <AddParticipant
                              key={index}
                              email={participant}
                              removeParticipant={removeParticipant}
                              role={index === 0 ? "Host" : "Participant"}
                            />
                          ))}
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex space-x-2">
                        <div className="flex  w-full flex-col">
                          <Input
                            value={currentParticipant}
                            onChange={(e) =>
                              setCurrentParticipant(e.target.value)
                            }
                            type="email"
                            disabled={isLoading}
                          />
                          {participantError && (
                            <span className="text-destructive text-sm mt-2">
                              {participantError}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            addParticipant();
                          }}
                          className="shrink-0"
                          disabled={isLoading}
                        >
                          Add Participant
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={(isPublic && participants.length < 2) || isLoading}
                >
                  {isLoading ? "Creating Meeting..." : "Create Meeting"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledMeetingForm;
