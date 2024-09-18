<script setup>
import Button from "./ui/button/Button.vue";
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
</script>
<template>
  <div class="flex w-full justify-center">
    <Card class="md:min-w-[30rem]">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl">Create a Meeting</CardTitle>
        <CardDescription>schedule a meeting with your team</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <form action="" class="grid gap-4">
          <FormField type="checkbox" name="make-private">
            <FormItem
              class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow"
            >
              <FormControl>
                <Checkbox />
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
