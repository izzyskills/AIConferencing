<script setup>
import { useColorMode } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
const mode = useColorMode({ disableTransition: false });
const toggleMode = () =>
  (mode.value = mode.value === "light" ? "dark" : "light");
</script>

<template>
  <Button @click="toggleMode" variant="outline" size="sm">
    <Icon
      icon="radix-icons:moon"
      class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      icon="radix-icons:sun"
      class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
