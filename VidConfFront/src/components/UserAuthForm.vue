<script setup>
import { ref } from "vue";
import { Loader2, GithubIcon } from "lucide-vue-next";
// import { GitHubLogo } from "radix-vue";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const isLoading = ref(false);
async function onSubmit() {
  e.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
}
</script>

<template>
  <div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
    <p class="text-sm text-muted-foreground">
      Enter your email below to create your account
    </p>
    <div :class="cn('grid gap-6 text-left', $attrs.class ?? '')">
      <form @submit="onSubmit">
        <div class="grid gap-2">
          <div class="grid gap-1">
            <Label for="firstname"> First Name</Label>
            <Input
              id="firstname"
              placeholder="James"
              autocomplete="cc-given-name"
              :disabled="isLoading"
            />
          </div>
          <div class="grid gap-1">
            <Label for="lastname"> Last Name</Label>
            <Input
              id="lastname"
              placeholder="doe"
              autocomplete="cc-family-name"
              :disabled="isLoading"
            />
          </div>
          <div class="grid gap-2">
            <Label for="email"> Email </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              auto-capitalize="none"
              auto-complete="email"
              auto-correct="off"
              :disabled="isLoading"
            />
          </div>
          <div class="grid gap-1">
            <Label for="password"> Password </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              auto-complete="new-password"
              :disabled="isLoading"
            />
          </div>
          <div>
            <Label for="password2"> Confirm Password</Label>
            <Input
              id="password2"
              placeholder="Password"
              type="password"
              autocomplete="new-password"
              :disabled="isLoading"
            />
          </div>
          <Button class="mt-4" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Create Account
          </Button>
        </div>
      </form>
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
    </div>
    <p class="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our
      <a href="/terms" class="underline underline-offset-4 hover:text-primary">
        Terms of Service
      </a>
      and
      <a
        href="/privacy"
        class="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </a>
      .
    </p>
  </div>
</template>
