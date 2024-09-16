<script setup>
import { RouterLink, RouterView } from "vue-router";
import DarkMode from "./components/DarkMode.vue";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <DarkMode />
    </nav>
  </header>

  <RouterView />
</template>
