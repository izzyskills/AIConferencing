<script setup>
import { ref } from "vue";
import { GithubIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { login_schema } from "./schemas";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useLogin } from "@/adapters/requests";
const isLoading = ref(false);
const formSchema = toTypedSchema(login_schema);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const { login } = useLogin();

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await login.mutateAsync(values);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="flex w-full justify-center">
    <Card class="md:min-w-[30rem]">
      <form @submit="onSubmit">
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl"> Login to Your account </CardTitle>
          <CardDescription> enter your email and password </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  auto-capitalize="none"
                  auto-complete="email"
                  auto-correct="off"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel> Password </FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  auto-complete="current-password"
                  v-bind="componentField"
                  :disabled="isLoading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <GithubIcon class="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline">
              <svg role="img" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" :disabled="isLoading" class="w-full">
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
