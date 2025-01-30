import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { queryClient } from "./adapters/api";

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin, {
  queryClient,
});
app.use(router);

app.mount("#app");
