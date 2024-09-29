import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useLogout } from "@/adapters/requests";

export const useAuthStateStore = defineStore("authstate", () => {
  const authstate = ref(JSON.parse(localStorage.getItem("authState") || "{}"));
  const setAuth = (auth) => {
    authstate.value = auth;
    localStorage.setItem("authState", JSON.stringify(auth));
  };
  const isLoggedIn = computed(() =>
    !!authstate.value.user?.user_uid ? true : false,
  );
  const logout = async () => {
    await useLogout().logout();
  };
  const getUser = computed(() => authstate.value?.user);
  return { authstate, setAuth, isLoggedIn, logout, getUser };
});
