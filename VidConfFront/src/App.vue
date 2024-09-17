<script setup>
import { RouterLink, RouterView } from "vue-router";
import DarkMode from "./components/DarkMode.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar />

  <RouterView />
</template>
