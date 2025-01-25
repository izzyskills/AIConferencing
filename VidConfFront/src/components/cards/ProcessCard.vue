<script setup>
const items = [
  { id: 1, imgSrc: "/images/mockup-image-02.jpg", alt: "App screen 02" },
  { id: 2, imgSrc: "/images/mockup-image-03.jpg", alt: "App screen 03" },
  { id: 3, imgSrc: "/images/mockup-image-04.jpg", alt: "App screen 04" },
];
</script>

<template>
  <section class="relative">
    <div class="max-w-7xl px-6 mx-auto md:px-4">
      <div class="border-border md:py-20 border-t py-12">
        <!-- Section header -->
        <div class="text-center max-w-4xl md:pb-20 mx-auto pb-12">
          <h2 class="font-red-hat-display mb-4 text-4xl">
            Build and style every element to perfection
          </h2>
          <p class="text-gray-600 text-xl dark:text-stone-400">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
            cupidatat.
          </p>
        </div>
        <!-- Glow illustration -->
        <svg
          aria-hidden="true"
          class="pointer-events-none transform -translate-x-1/2 cnid1 left-1/2 md:block md:mt-40 absolute hidden mt-20 z-[-1]"
          height="509"
          viewBox="0 0 854 509"
          width="854"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              cx="50%"
              cy="50%"
              fx="50%"
              fy="50%"
              id="iphonesill__a"
              r="39.386%"
            >
              <stop offset="0%" stop-color="#667EEA"></stop>
              <stop offset="100%" stop-color="#667EEA" stop-opacity="0"></stop>
            </radialGradient>
            <radialGradient
              cx="50%"
              cy="50%"
              fx="50%"
              fy="50%"
              id="iphonesill__b"
              r="39.386%"
            >
              <stop offset="0%" stop-color="#9F7AEA"></stop>
              <stop offset="100%" stop-color="#9F7AEA" stop-opacity="0"></stop>
            </radialGradient>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(-64 -64)">
            <circle
              cx="300"
              cy="300"
              fill="url(#iphonesill__a)"
              fill-opacity=".64"
              r="300"
            ></circle>
            <circle
              cx="729"
              cy="384"
              fill="url(#iphonesill__b)"
              fill-opacity=".72"
              r="240"
            ></circle>
          </g>
        </svg>
        <!-- Items -->
        <div
          class="grid md:grid-cols-3 md:max-w-none gap-12 items-start md:gap-x-6 max-w-sm mx-auto"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="items-center relative flex-col flex"
          >
            <!-- Line connecting items -->
            <div
              v-if="item.id < items.length"
              aria-hidden="true"
              class="dark:from-neutral-900 dark:via-teal-500 dark:to-neutral-900 bg-gradient-to-r via-teal-500 from-white to-white opacity-50 md:block absolute hidden h-[1px]"
              style="
                width: calc(100% - 48px);
                left: calc(50% + 48px);
                top: 24px;
              "
            >
              <div
                class="dark:border-neutral-900 border-dashed border-white absolute border-t inset-0"
              ></div>
            </div>

            <!-- Number -->
            <div
              class="text-white cidpy cv8tj ckzxk justify-center items-center rounded-full bg-teal-400 cf4hw md:mb-12 mb-8 flex h-12 w-12"
            >
              {{ item.id }}
            </div>
            <!-- Mobile mockup -->
            <div class="justify-center items-center inline-flex relative">
              <!-- Image inside mockup size: 290x624px (or 580x1248px for Retina devices) -->
              <img
                :alt="item.alt"
                class="absolute"
                height="624"
                :src="item.imgSrc"
                style="max-width: 84.33%"
                width="290"
              />
              <!-- iPhone mockup -->
              <img
                alt="iPhone mockup"
                aria-hidden="true"
                class="pointer-events-none max-w-full relative mx-auto h-auto"
                height="674"
                src="/images/iphone-mockup.png"
                width="344"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add any additional styles here */
</style>
