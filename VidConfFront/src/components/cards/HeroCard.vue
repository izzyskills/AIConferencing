<script setup lang="ts">
import { ref } from "vue";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const modalExpanded = ref(false);
</script>

<template>
  <div>
    <section>
      <div class="max-w-7xl md:px-6 mx-auto px-4">
        <div class="md:pb-16 md:pt-40 pb-10 pt-32">
          <!-- Hero content -->
          <div class="grid-cols-12 items-center md:gap-12 lg:gap-20 md:grid">
            <!-- Content -->
            <div class="md:col-span-7 md:text-left text-center md:mb-0 mb-8">
              <h1
                class="font-red-hat-display lg:text-[5.5rem] leading-[1.11] font-black mb-4 md:text-[4-rem] text-[3.5rem] aos-init aos-animate"
                data-aos="fade-down"
              >
                Video Conferencing, reimagined
              </h1>
              <p
                class="text-gray-600 dark:text-neutral-100 text-xl aaos-init aos-animate"
                data-aos="fade-down"
                data-aos-delay="150"
              >
                Our landing page template works on all devices, so you only have
                to set it up once, and get beautiful results forever.
              </p>
              <!-- CTA form -->
              <form
                class="mt-8 aos-init aos-animate"
                data-aos="fade-down"
                data-aos-delay="300"
              >
                <div
                  class="justify-center max-w-lg sm:flex-row sm:max-w-md flex-col md:mx-0 mx-auto flex"
                >
                  <Input
                    aria-label="Phone number"
                    class="md:mb-0 mr-2 w-full mb-2"
                    placeholder="Phone number"
                    type="tel"
                  />
                  <Button class="text-white bg-teal-400">
                    <RouterLink to="#0"> Request code </RouterLink>
                  </Button>
                </div>
                <!-- Success message -->
                <!-- <p class="text-center md:text-left mt-2 opacity-75 text-sm">Thanks for subscribing!</p> -->
              </form>
              <ul
                class="text-gray-600 c0atf md:max-w-none max-w-lg sm:max-w-md mx-auto mb-[-2] mt-8 aos-init aos-animate"
                data-aos="fade-down"
                data-aos-delay="450"
              >
                <li class="items-center mb-2 flex">
                  <svg
                    class="text-teal-400 fill-current flex-shrink-0 mr-2 h-3 w-3"
                    viewbox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                    ></path>
                  </svg>
                  <span> Lorem ipsum is placeholder text commonly. </span>
                </li>
                <li class="items-center mb-2 flex">
                  <svg
                    class="text-teal-400 fill-current flex-shrink-0 mr-2 h-3 w-3"
                    viewbox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                    ></path>
                  </svg>
                  <span> Excepteur sint occaecat cupidatat. </span>
                </li>
                <li class="items-center mb-2 flex">
                  <svg
                    class="text-teal-400 fill-current flex-shrink-0 mr-2 h-3 w-3"
                    viewbox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                    ></path>
                  </svg>
                  <span> Lorem ipsum is placeholder text commonly. </span>
                </li>
              </ul>
            </div>
            <!-- Mobile mockup -->
            <div
              class="md:text-right col-span-5 text-center aos-init aos-animate"
              data-aos="fade-up"
              data-aos-delay="450"
              x-data="{ modalExpanded: false }"
            >
              <div class="justify-center items-center inline-flex relative">
                <!-- Glow illustration -->
                <svg
                  aria-hidden="true"
                  class="pointer-events-none cimtg absolute mr-12 mt-32 z-[-1]"
                  fill="none"
                  height="634"
                  viewbox="0 0 678 634"
                  width="678"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="240"
                    cy="394"
                    fill="url(#piphoneill_paint0_radial)"
                    fill-opacity=".4"
                    r="240"
                  ></circle>
                  <circle
                    cx="438"
                    cy="240"
                    fill="url(#piphoneill_paint1_radial)"
                    fill-opacity=".6"
                    r="240"
                  ></circle>
                  <defs>
                    <radialgradient
                      cx="0"
                      cy="0"
                      gradienttransform="rotate(90 -77 317) scale(189.054)"
                      gradientunits="userSpaceOnUse"
                      id="piphoneill_paint0_radial"
                      r="1"
                    >
                      <stop stop-color="#667EEA"></stop>
                      <stop
                        offset="1"
                        stop-color="#667EEA"
                        stop-opacity=".01"
                      ></stop>
                    </radialgradient>
                    <radialgradient
                      cx="0"
                      cy="0"
                      gradienttransform="rotate(90 99 339) scale(189.054)"
                      gradientunits="userSpaceOnUse"
                      id="piphoneill_paint1_radial"
                      r="1"
                    >
                      <stop stop-color="#9F7AEA"></stop>
                      <stop
                        offset="1"
                        stop-color="#9F7AEA"
                        stop-opacity=".01"
                      ></stop>
                    </radialgradient>
                  </defs>
                </svg>
                <!-- Image inside mockup size: 290x624px (or 580x1248px for Retina devices) -->
                <img
                  alt="Features illustration"
                  class="absolute"
                  height="624"
                  src="/images/mockup-image-01.jpg"
                  style="max-width: 84.33%"
                  width="290"
                />
                <!-- iPhone mockup -->
                <img
                  alt="iPhone mockup"
                  aria-hidden="true"
                  class="pointer-events-none max-w-none max-w-full relative mr-0 mx-auto h-auto"
                  height="674"
                  src="/images/iphone-mockup.png"
                  width="344"
                />
                <!-- Play button -->
                <a
                  @click.prevent="modalExpanded = true"
                  aria-controls="modal"
                  class="cmemh duration-150 ease-in-out transition absolute"
                  href="#0"
                >
                  <img
                    alt="Play"
                    height="96"
                    src="/images/play-button.svg"
                    width="96"
                  />
                </a>
              </div>
              <!-- Modal backdrop -->
              <div
                aria-hidden="true"
                class="transition bg-black bg-opacity-75 inset-0 fixed z-50 opacity-0"
                style="display: none"
                x-show="modalExpanded"
                x-transition:enter="transition ease-in-out duration-150"
                x-transition:enter-end="opacity-100"
                x-transition:enter-start="opacity-0"
                x-transition:leave="transition ease-in-out duration-100"
                x-transition:leave-end="opacity-100"
                x-transition:leave-start="opacity-0"
              ></div>

              <!-- Modal dialog -->
              <div
                aria-labelledby="modal-headline"
                aria-modal="true"
                class="overflow-hidden justify-center items-center transform px-4 inset-0 fixed z-50 flex"
                id="modal"
                role="dialog"
                style="display: none"
                x-show="modalExpanded"
                x-transition:enter="transition ease-in-out duration-200"
                x-transition:enter-end="opacity-0 scale-95"
                x-transition:enter-start="opacity-100 scale-105"
                x-transition:leave="transition ease-in-out duration-200"
                x-transition:leave-end="opacity-100 scale-105"
                x-transition:leave-start="opacity-0 scale-95"
              >
                <div
                  @click.outside="modalExpanded = false"
                  @keydown.escape.window="modalExpanded = false"
                  class="overflow-auto max-h-full max-w-7xl bg-white w-full"
                >
                  <div class="relative pb-[56.25%]">
                    <video
                      class="absolute h-full w-full"
                      controls=""
                      height="1080"
                      loop=""
                      width="1920"
                      x-init="$watch('modalExpanded', value =&gt; value ? $el.play() : $el.pause())"
                    >
                      <source src="./videos/video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
