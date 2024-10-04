<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const formSchema = toTypedSchema(meeting_schema);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    capacity: 2,
    date: new Date().toISOString().slice(0, 16),
    private: false,
  },
});
const date = ref(new Date().toISOString().slice(0, 16));
const formattedDate = computed(() => {
  return date.value.toString().slice(0, 16);
});
const updateDate = (value) => {
  date.value = new Date(value);
};

const checkDate = () => {
  if (date.value < new Date()) {
    date.value = new Date();
  }
};

const onSubmit = handleSubmit(async (values) => {
  checkDate();
  console.log(values);
});

onMounted(
  () => {
    const interval = setInterval(checkDate, 6000);
  },
  onUnmounted(() => {
    clearInterval(interval);
  }),
);
</script>
<template>
  <div class="flex w-full justify-center">
    <Card class="md:min-w-[30rem]">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Create a Meeting</CardTitle>
        <CardDescription
          >schedule a meeting with your team<br />note meetings only last for an
          hour</CardDescription
        >
      </CardHeader>
      <CardContent class="grid gap-4">
        <form @submit="onSubmit" class="grid gap-4">
          <FormField v-slot="{ componentField }" type="text" name="title">
            <FormItem>
              <FormLabel> Meeting Title</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  placeholder="name for meeting"
                  name="title"
                  id="title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" type="number" name="capacity">
            <FormItem>
              <FormLabel>Meeting Capacity</FormLabel>
              <FormControl>
                <Input v-bind="componentField" name="capacity" id="capacity" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            type="datetime-local"
            name="date"
          >
            <FormItem>
              <FormLabel>Meeting Date</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="datetime-local"
                  name="date"
                  :value="formattedDate"
                  @input="updateDate($event.target.value)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="private"
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

          <Button type="submit"> Create Meeting </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
