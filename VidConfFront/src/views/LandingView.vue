<script setup>
import CarouselCard from "@/components/cards/CarouselCard.vue";
import FeaturesCard from "@/components/cards/FeaturesCard.vue";
import HeroCard from "@/components/cards/HeroCard.vue";
import ProcessCard from "@/components/cards/ProcessCard.vue";
import StatsCard from "@/components/cards/StatsCard.vue";
import TabCard from "@/components/cards/TabCard.vue";
import TestimonialsCard from "@/components/cards/TestimonialsCard.vue";
import Footer from "@/components/Footer.vue";
</script>
<template>
  <div
    aria-hidden="true"
    class="pointer-events-none max-w-7xl relative mx-auto z-[-1] h-0"
  >
    <svg
      class="translate-x-1/2 dark:opacity-40 transform absolute right-0 mr-[-16] top-0"
      fill="none"
      height="502"
      width="800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="400"
        cy="102"
        fill="url(#heroglow_paint0_radial)"
        fill-opacity=".6"
        r="400"
      ></circle>
      <circle
        cx="209"
        cy="289"
        fill="url(#heroglow_paint1_radial)"
        fill-opacity=".4"
        r="170"
      ></circle>
      <defs>
        <radialgradient
          cx="0"
          cy="0"
          gradienttransform="rotate(90 149 251) scale(315.089)"
          gradientunits="userSpaceOnUse"
          id="heroglow_paint0_radial"
          r="1"
        >
          <stop stop-color="#3ABAB4"></stop>
          <stop offset="1" stop-color="#3ABAB4" stop-opacity=".01"></stop>
        </radialgradient>
        <radialgradient
          cx="0"
          cy="0"
          gradienttransform="rotate(90 -40 249) scale(133.913)"
          gradientunits="userSpaceOnUse"
          id="heroglow_paint1_radial"
          r="1"
        >
          <stop stop-color="#667EEA"></stop>
          <stop offset="1" stop-color="#667EEA" stop-opacity=".01"></stop>
        </radialgradient>
      </defs>
    </svg>
  </div>
  <HeroCard />
  <StatsCard />
  <CarouselCard />
  <TabCard />
  <ProcessCard />
  <TestimonialsCard />
  <FeaturesCard />
  <Footer />
</template>
