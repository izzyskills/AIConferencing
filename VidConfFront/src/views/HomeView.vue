<script setup>
import TheWelcome from "../components/TheWelcome.vue";
import { Button } from "@/components/ui/button";
import DarkMode from "@/components/DarkMode.vue";
</script>

<template>
  <main>
    <TheWelcome />
    <DarkMode />
    <Button>click me</Button>
  </main>
</template>
