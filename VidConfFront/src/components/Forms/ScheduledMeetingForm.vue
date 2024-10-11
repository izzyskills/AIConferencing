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
const { createRoom } = useCreateRoom();
const onSubmit = handleSubmit(async (values) => {
  const created_by = getUser.value.user_uid;
  values["created_by"] = created_by;
  if (new Date(values.opens_at) <= new Date()) {
    values["in_session"] = true;
  }
  createRoom.mutateAsync(values);
  console.log(values);
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
        <form @submit="onSubmit" class="grid gap-4">
          <div class="grid grid-cols-2 gap-2">
            <div>
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
                type="number"
                name="capacity"
              >
                <FormItem>
                  <FormLabel>Meeting Capacity</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      name="capacity"
                      id="capacity"
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
                  class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow"
                >
                  <FormControl>
                    <Checkbox :checked="value" @update:checked="handleChange" />
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
            <div :class="`md:mt-8`">
              <div class="flex space-x-2">
                <Input />
                <Button variant="secondary" class="shrink-0">
                  Add Participant
                </Button>
              </div>
              <Separator class="my-4" />
              <div class="space-y-4">
                <h4 class="text-sm font-medium">People with access</h4>
                <div class="grid gap-6">
                  <AddParticipant
                    name="John Doe"
                    email="Johndoe@gmail.com"
                    imagelink="https://randomuser.me/api/port"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button type="submit"> Create Meeting </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```
