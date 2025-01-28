<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button/";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { meeting_schema } from "./schemas";
import { useAuth } from "@/composables/useauth";
import { useCreateRoom } from "@/adapters/requests";
import { Separator } from "@/components//ui/separator";
import AddParticipant from "../cards/addParticipant.vue";

const { getUser } = useAuth();
const formSchema = toTypedSchema(meeting_schema);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    capacity: 2,
    opens_at: new Date().toISOString().slice(0, 16),
    public: false,
  },
});
const isChecked = ref(false);
const participants = ref([getUser.value.email]);
const current_participant = ref("");
const participantError = ref("");

const participantSchema = z.string().email("Invalid email address");

const addParticipant = () => {
  const email = current_participant.value;
  const validation = participantSchema.safeParse(email);

  if (!validation.success) {
    participantError.value = validation.error.errors[0].message;
    return;
  }

  if (participants.value.includes(email) || email === getUser.value.email) {
    participantError.value = "Email is already added or is your own email";
    return;
  }

  participants.value.push(email);
  current_participant.value = "";
  participantError.value = "";
};

const removeParticipant = (participant) => {
  participants.value = participants.value.filter((p) => p !== participant);
};

const { createRoom } = useCreateRoom();
const onSubmit = handleSubmit(async (values) => {
  const created_by = getUser.value.user_uid;
  values["created_by"] = created_by;
  values["members"] = participants.value;
  values["members"].push(getUser.value?.email);
  if (new Date(values.opens_at) <= new Date()) {
    values["in_session"] = true;
  }
  console.log(values);
  createRoom.mutateAsync(values);
});
</script>

<template>
  <div class="flex w-full justify-center">
    <Card class="md:min-w-[30rem]">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Create a Meeting</CardTitle>
        <CardDescription>note meetings only last for an hour</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <form @submit.prevent="onSubmit" class="grid gap-4">
          <div :class="isChecked ? ` grid md:grid-cols-2 gap-2` : ``">
            <div class="gird gap-4">
              <FormField v-slot="{ componentField }" type="text" name="name">
                <FormItem>
                  <FormLabel> Meeting Title</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="text"
                      placeholder="name for meeting"
                      name="name"
                      id="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                type="datetime-local"
                name="opens_at"
              >
                <FormItem>
                  <FormLabel>Meeting Date</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="datetime-local"
                      name="opens_at"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ value, handleChange }"
                type="checkbox"
                name="public"
              >
                <FormItem
                  class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow mt-4"
                >
                  <FormControl>
                    <Checkbox
                      v-bind="isChecked"
                      :checked="value"
                      @update:checked="
                        (value) => {
                          handleChange(value);
                          isChecked = !isChecked;
                        }
                      "
                    />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Make Meeting Private</FormLabel>
                    <FormDescription>
                      this will only allow invited participants to join
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>
            </div>
            <!-- Conditionally render the div based on isChecked -->
            <div v-if="isChecked" :class="`md:mt-8`">
              <Separator class="md:hidden my-4" />
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium">People with access</h4>
                  <h6 class="text-xs font-light text-muted-foreground">
                    Must be at least 2 participants
                  </h6>
                </div>
                <div class="grid gap-6">
                  <AddParticipant
                    v-for="(participant, index) in participants"
                    :key="index"
                    :email="participant"
                    :removeParticipant="removeParticipant"
                    :role="index === 0 ? 'Host' : 'Participant'"
                  />
                </div>
              </div>
              <Separator class="my-4" />
              <div class="flex space-x-2">
                <div class="flex flex-col">
                  <Input v-model="current_participant" type="email" />
                  <span
                    v-if="participantError"
                    class="text-destructive text-sm mt-2"
                    >{{ participantError }}</span
                  >
                </div>
                <Button
                  variant="secondary"
                  @click.prevent="addParticipant"
                  class="shrink-0"
                >
                  Add Participant
                </Button>
              </div>
            </div>
          </div>
          <Button
            :disabled="isChecked && participants.length < 1"
            type="submit"
          >
            Create Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
