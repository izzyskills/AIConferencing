import { useAuth } from "@/composables/useauth";
import { apiClient, queryClient } from "./api";
import { useMutation } from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { ref } from "vue";

function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const from = route.query.from || "/dashboard";
  const { setAuth } = useAuth();
  const error = ref(null);
  const login = useMutation({
    mutationFn: (formData) => {
      return apiClient.post("auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setAuth({ userId, token });
      queryClient.invalidateQueries(["userdata", userId]);
      router.push(from, { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const { data } = err.response;
        if (data && data.error === "your email has not been verified") {
          router.push(`/verify/email/${data.email}`);
        } else {
          error.value = data.error || "An error occurred during login";
        }
      } else {
        error.value = "An unexpected error occurred";
      }
      console.error("Login error:", err);
    },
  });

  return {
    error,
    login,
  };
}

function useSignup() {
  const router = useRouter();
  const error = ref(null);

  const signup = useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(`auth/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (!data || !data.email) {
        console.error("Invalid data received:", data);
        error.value = "Invalid response from server";
        return;
      }
      queryClient.invalidateQueries("userdata");
      // Note: You'll need to implement a toast notification system for Vue
      // toast.success("You have been successfully registered.");
      router.push(`/verify/email/${data.email}`);
    },
    onError: (err) => {
      console.error("Signup error:", err);
      error.value =
        err.response?.data?.error || "An error occurred during signup";
    },
  });

  return {
    signup,
    error,
  };
}
