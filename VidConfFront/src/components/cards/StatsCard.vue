<script setup>
import { ref } from "vue";

const items = ref([
  { value: "2.4M", description: "Days turn around", delay: "0" },
  { value: "7M", description: "Days turn around", delay: "100" },
  { value: "7.4%", description: "Days turn around", delay: "200" },
  { value: "49K", description: "Days turn around", delay: "300" },
]);
</script>

<template>
  <section class="relative">
    <!-- Background gradient (light version only) -->
    <div
      aria-hidden="true"
      class="pointer-events-none bg-gradient-to-t from-gray-100 to-transparent absolute bottom-0 right-0 left-0 z-[-10] h-128"
    ></div>
    <!-- End background gradient (light version only) -->
    <div class="max-w-7xl relative px-6 mx-auto">
      <div class="pb-20">
        <div
          class="grid md:grid-cols-4 grid-cols-2 text-center gap-6"
          data-aos-id-stats=""
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            class="shadow-2xl bg-card text-card-foreground px-1 py-8 aos-init aos-animate"
            data-aos="fade-down"
            data-aos-anchor="[data-aos-id-stats]"
            :data-aos-delay="item.delay"
          >
            <div
              class="font-red-hat-display text-[2.63rem] leading-[1.24] mb-1"
            >
              {{ item.value }}
            </div>
            <div class="text-gray-600">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
