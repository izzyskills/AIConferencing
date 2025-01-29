<script setup>
import { useAuth } from "@/composables/useauth";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const { isLoggedIn } = useAuth();
const router = useRouter();

onMounted(() => {
  const timer = setTimeout(() => {
    if (isLoggedIn.value) {
      router.replace({ path: "/dashboard" });
    } else {
      router.replace({ path: "/" });
    }
  }, 2000);

  onUnmounted(() => {
    clearTimeout(timer);
  });
});
</script>

<template>
  <div>
    <section class="pt-28 px-4 md:px-10 lg:px-20 flex w-full">
      <div class="center">
        <h1 class="text-center text-accent text-6xl">
          Page Does not Exist. Redirecting...
        </h1>
      </div>
    </section>
  </div>
</template>
