<script setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";

// Register Swiper custom elements globally
register();

const items = ref([
  {
    src: "./images/carousel-item-01.jpg",
    alt: "Carousel item 01",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-02.jpg",
    alt: "Carousel item 02",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-03.jpg",
    alt: "Carousel item 03",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-04.jpg",
    alt: "Carousel item 04",
    label: "Creative Services",
  },
  {
    src: "./images/carousel-item-05.jpg",
    alt: "Carousel item 05",
    label: "Creative Services",
  },
]);
</script>

<template>
  <section class="border-transparent border-t dark:border-foreground">
    <div class="md:py-20 px-12">
      <div class="max-w-7xl md:px-6 mx-auto px-4">
        <!-- Section header -->
        <div class="text-center max-w-4xl md:pb-16 mx-auto pb-12">
          <h1 class="font-red-hat-display mb-4">
            From rough design files, to powerful products
          </h1>
          <p class="text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
            cupidatat.
          </p>
        </div>
      </div>
      <!-- Carousel built with Swiper.js -->
      <swiper-container
        loop="true"
        navigation
        pagination-clickable="true"
        class="swiper-container"
      >
        <swiper-slide
          v-for="(item, index) in items"
          :key="index"
          class="swiper-slide max-w-2xl"
          style="margin-right: 24px"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            class="transition-opacity duration-300"
            height="460"
            width="540"
          />
          <div
            class="transition-opacity duration-300 absolute flex-col inset-0 flex"
          >
            <div class="flex flex-grow">
              <a
                class="text-white bg-teal-500 inline-flex self-center mx-auto"
                href="#0"
              >
                Learn more
              </a>
            </div>
            <div class="absolute bottom-0 right-0 p-6">
              <a
                class="text-white bg-opacity-50 rounded-full duration-150 bg-gray-900 text-center px-3 py-2"
                href="#0"
              >
                {{ item.label }}
              </a>
            </div>
          </div>
        </swiper-slide>
        <!-- Pagination -->
        <div class="swiper-pagination"></div>
      </swiper-container>
      <!-- Arrows -->
      <div class="max-w-7xl px-6 mx-auto">
        <div class="justify-between items-center mt-16 flex">
          <button
            aria-label="Previous slide"
            class="carousel-prev bg-teal-500 justify-center items-center duration-150 box-content ease-in-out transition shadow-xl relative z-20 flex h-12 w-12 p-1"
          >
            <span class="sr-only">Previous</span>
            <svg
              class="text-white fill-current duration-150 ease-in-out transition h-4 w-4"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.7 14.7l1.4-1.4L3.8 9H16V7H3.8l4.3-4.3-1.4-1.4L0 8z"
              ></path>
            </svg>
          </button>
          <button
            aria-label="Next slide"
            class="carousel-next bg-teal-500 justify-center items-center duration-150 box-content ease-in-out transition shadow-xl relative z-20 flex h-12 w-12 p-1"
          >
            <span class="sr-only">Next</span>
            <svg
              class="text-white fill-current duration-150 ease-in-out transition h-4 w-4"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
