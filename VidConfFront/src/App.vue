<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
//TODO Ensure proper login and signup flow
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import Aos from "aos";
import { Toaster } from "./components/ui/toast";
Aos.init();
</script>
<template>
  <div class="overflow-hidden min-h-screen flex-col flex">
    <Navbar />
    <Toaster />
    <main class="flex-grow">
      <RouterView />
    </main>
    <VueQueryDevtools />
  </div>
</template>
