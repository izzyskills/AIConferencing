import { useAuthStateStore } from "@/stores/authState";
import { storeToRefs } from "pinia";

export function useAuth() {
  const authStore = useAuthStateStore();

  // Use storeToRefs for reactive state and computed properties
  const { authstate, isLoggedIn, getUser } = storeToRefs(authStore);

  // Destructure methods directly
  const { setAuth, logout } = authStore;

  return {
    authstate,
    isLoggedIn,
    getUser,
    setAuth,
    logout,
  };
}
