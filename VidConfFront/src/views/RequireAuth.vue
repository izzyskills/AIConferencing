<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useauth";

const router = useRouter();
const route = useRoute();

const { isLoggedIn } = useAuth();

if (!isLoggedIn.value) {
  router.push({
    name: "login",
    query: { redirect: route.fullPath },
  });
}
</script>

<template>
  <slot v-if="isLoggedIn" />
</template>
