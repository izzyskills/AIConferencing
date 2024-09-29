import { useAuth } from "@/composables/useauth";
import { apiClient, queryClient } from "./api";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ref } from "vue";
import { useAxiosPrivate } from "@/composables/useAxiosPrivate";

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
      const token = res.data.access_token;
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user;
      setAuth({ user, token });
      queryClient.invalidateQueries(["userdata", user.uid]);
      router.push(from, { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const { data } = err.response;
        if (data && data.error_code === "invalid_email_or_password") {
          error.value = "invalid mail or passowrd";
        } else if (data && data.error_code === "account_not_verified") {
          error.value = "Account not Verified \n check mail for details";
        } else {
          error.value = data.error_code || "An error occurred during login";
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
      if (!data || !data.user.email) {
        console.error("Invalid data received:", data);
        error.value = "Invalid response from server";
        return;
      }
      queryClient.invalidateQueries("userdata");
      // Note: You'll need to implement a toast notification system for Vue
      // toast.success("You have been successfully registered.");
      router.push("/login");
    },
    onError: (err) => {
      console.error("Signup error:", err);
      error.value =
        err.response?.data?.error_code || "An error occurred during signup";
    },
  });

  return {
    signup,
    error,
  };
}

function useLogout() {
  const router = useRouter();
  const error = ref(null);
  const { setAuth } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  const logout = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiClientPrivate.get("/auth/logout");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      setAuth({});
      queryClient.invalidateQueries();
      router.push("/", { replace: true });
    },
    onError: (err) => {
      console.error("Lougout error: ", err);
      error.value =
        err.response?.data?.error_code || "an arror occured during logging out";
    },
  });
  return { error, logout };
}

export { useSignup, useLogin, useLogout };
