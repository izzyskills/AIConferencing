<script setup>
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RouterLink } from "vue-router";
import DarkMode from "@/components/DarkMode.vue";
import MenuIcon from "@/components/icons/MenuIcon.vue";
import MountainIcon from "@/components/icons/MountainIcon.vue";
</script>

<template>
  <header class="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" class="lg:hidden">
          <MenuIcon class="h-6 w-6" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <RouterLink to="#" class="mr-6 hidden lg:flex">
          <MountainIcon class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </RouterLink>
        <div class="grid gap-2 py-6">
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            Home
          </RouterLink>
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            About
          </RouterLink>
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            Services
          </RouterLink>
          <RouterLink
            to="#"
            class="flex w-full items-center py-2 text-lg font-semibold"
          >
            Contact
          </RouterLink>
        </div>
        <DarkMode />
      </SheetContent>
    </Sheet>
    <RouterLink to="#" class="mr-6 hidden lg:flex gap-2">
      <MountainIcon class="h-6 w-6" />
      <span class="">Acme Inc</span>
    </RouterLink>
    <nav class="ml-auto hidden lg:flex gap-6">
      <RouterLink
        to="#"
        class="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-popover hover:text-popover-foreground focus:bg-popover focus:text-popover-foreground data-[active]:bg-accent-foreground/50 data-[state=open]:bg-accent-foreground/50"
      >
        Home
      </RouterLink>
      <RouterLink
        to="#"
        class="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-popover hover:text-popover-foreground focus:bg-popover focus:text-popover-foreground data-[active]:bg-accent-foreground/50 data-[state=open]:bg-accent-foreground/50"
      >
        About
      </RouterLink>
      <Button variant="outline" size="sm">
        <RouterLink to="login"> Login </RouterLink>
      </Button>
      <Button size="sm">
        <RouterLink to="signup"> Register </RouterLink>
      </Button>

      <DarkMode />
    </nav>
  </header>
</template>
