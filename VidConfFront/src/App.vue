<script setup>
import { RouterLink, RouterView } from "vue-router";
import DarkMode from "./components/DarkMode.vue";
import Navbar from "./components/Navbar.vue";
//TODO Ensure proper login and signup flow
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import Aos from "aos";
Aos.init();
</script>
<template>
  <div class="overflow-hidden min-h-screen flex-col flex">
    <Navbar />

    <main class="flex-grow">
      <RouterView />
    </main>
    <VueQueryDevtools />
  </div>
</template>
