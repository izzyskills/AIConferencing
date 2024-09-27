<script setup>
import { RouterLink, RouterView } from "vue-router";
import DarkMode from "./components/DarkMode.vue";
import Navbar from "./components/Navbar.vue";
//TODO Ensure proper login and signup flow
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>
<template>
  <Navbar />

  <RouterView />
  <VueQueryDevtools />
</template>
