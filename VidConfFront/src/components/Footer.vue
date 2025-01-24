<script setup>
import { RouterLink } from "vue-router";

const footerLinks = [
  {
    title: "Products",
    links: [
      { text: "Drag And Drop", url: "#0", type: "internal" },
      { text: "Visual Studio X", url: "#0", type: "internal" },
      { text: "Easy Content", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Industries and tools", url: "#0", type: "internal" },
      { text: "Use cases", url: "#0", type: "internal" },
      { text: "Blog", url: "#0", type: "internal" },
      { text: "Online events", url: "#0", type: "internal" },
      { text: "Nostrud exercitation", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "Diversity & inclusion", url: "#0", type: "internal" },
      { text: "About us", url: "#0", type: "internal" },
      { text: "Press", url: "#0", type: "internal" },
      { text: "Customer stories", url: "#0", type: "internal" },
      { text: "Online communities", url: "#0", type: "internal" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "Documentation", url: "#0", type: "internal" },
      { text: "Tutorials & guides", url: "#0", type: "internal" },
      { text: "Webinars", url: "#0", type: "internal" },
      { text: "Open-source", url: "#0", type: "internal" },
    ],
  },
];

const socialLinks = [
  {
    ariaLabel: "Twitter",
    iconPath:
      "M13.063 9l3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z",
    url: "#0",
  },
  {
    ariaLabel: "Github",
    iconPath:
      "M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z",
    url: "#0",
  },
  {
    ariaLabel: "Facebook",
    iconPath:
      "M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z",
    url: "#0",
  },
  {
    ariaLabel: "Instagram",
    iconPath:
      "M20.145 11.892a1 1 0 110-2 1 1 0 010 2zm-4.145 8.108c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm4 10h-8c-2.056 0-4-1.944-4-4v-8c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zm-8-14c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2v-8c0-.935-1.065-2-2-2h-8z",
    url: "#0",
  },
  {
    ariaLabel: "Linkedin",
    iconPath:
      "M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z",
    url: "#0",
  },
];
</script>

<template>
  <footer class="relative">
    <div class="max-w-7xl px-6 mx-auto md:px-4">
      <div class="cq8p6 border-gray-300 md:py-16 border-t mt-[-1px] py-12">
        <!-- Footer illustration -->
        <div aria-hidden="true" class="pointer-events-none z-[-1]">
          <svg
            class="transform -translate-x-1/2 cimtg absolute bottom-0 left-0 ml-24"
            fill="none"
            height="264"
            width="800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="400"
              cy="400"
              fill="url(#footerglow_paint0_radial)"
              fill-opacity=".4"
              r="400"
            ></circle>
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="rotate(90 0 400) scale(315.089)"
                gradientUnits="userSpaceOnUse"
                id="footerglow_paint0_radial"
                r="1"
              >
                <stop stop-color="#3ABAB4"></stop>
                <stop offset="1" stop-color="#3ABAB4" stop-opacity=".01"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>
        <!-- Top area: Blocks -->
        <div class="grid grid-cols-12 md:gap-20 mb-12 gap-8">
          <!-- 1st block -->
          <div class="col-span-2 md:col-span-3">
            <!-- Logo -->
            <RouterLink aria-label="Cruip" class="inline-block" to="/">
              <svg
                class="h-8 w-8"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="flogo_a"
                    x1="26%"
                    x2="100%"
                    y1="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#3ABAB4"></stop>
                    <stop offset="100%" stop-color="#7F9CF5"></stop>
                  </linearGradient>
                  <linearGradient
                    id="flogo_b"
                    x1="26%"
                    x2="100%"
                    y1="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#3ABAB4"></stop>
                    <stop
                      offset="100%"
                      stop-color="#3ABAB4"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M32 16h-8a8 8 0 10-16 0H0C0 7.163 7.163 0 16 0s16 7.163 16 16z"
                  fill="url(#flogo_a)"
                ></path>
                <path
                  d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16h8a8 8 0 1016 0h8z"
                  fill="url(#flogo_b)"
                ></path>
              </svg>
            </RouterLink>
          </div>
          <!-- 2nd, 3rd, 4th and 5th blocks -->
          <div class="col-span-10 md:grid-cols-4 grid-cols-2 gap-8 grid">
            <div v-for="block in footerLinks" :key="block.title" class="ceng1">
              <h6 class="cf4hw cwaxc mb-2">{{ block.title }}</h6>
              <ul>
                <li v-for="link in block.links" :key="link.text" class="mb-1">
                  <component
                    :is="link.type === 'internal' ? RouterLink : 'a'"
                    :to="link.type === 'internal' ? link.url : undefined"
                    :href="link.type === 'external' ? link.url : undefined"
                    class="text-gray-600 dark:text-stone-400 duration-150 ease-in-out transition"
                  >
                    {{ link.text }}
                  </component>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Bottom area -->
        <div class="flex justify-between items-center">
          <!-- Social links -->
          <ul class="order-2 mb-0 ml-4 md:mb-4 flex">
            <li
              v-for="social in socialLinks"
              :key="social.ariaLabel"
              class="ml-4"
            >
              <a
                :aria-label="social.ariaLabel"
                class="text-white bg-teal-500 cvvk7 capfz cj3dx csz0f justify-center items-center rounded-full duration-150 ease-in-out transition flex"
                :href="social.url"
                target="_blank"
              >
                <svg
                  class="fill-current h-8 w-8"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path :d="social.iconPath"></path>
                </svg>
              </a>
            </li>
          </ul>
          <!-- Middle links -->
          <div class="c91hr order-1 mb-0 ceng1 md:mb-2">
            <RouterLink
              class="text-gray-600 c0atf csz0f duration-150 ease-in-out transition"
              to="/terms"
            >
              Terms
            </RouterLink>
            ·
            <RouterLink
              class="text-gray-600 c0atf csz0f duration-150 ease-in-out transition"
              to="/privacy-policy"
            >
              Privacy Policy
            </RouterLink>
          </div>
          <!-- Copyrights note -->
          <div class="text-gray-600 c0atf ceng1 mr-4">
            © Cruip.com. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
