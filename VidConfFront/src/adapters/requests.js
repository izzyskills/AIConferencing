import { useAuth } from "@/composables/useauth";
import { apiClient, queryClient } from "./api";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ref } from "vue";
import { useAxiosPrivate } from "@/composables/useAxiosPrivate";
import { handleErrors } from "@/lib/utils";
import { toast, useToast } from "@/components/ui/toast";
import { blobToBase64 } from "@/utils/blobtojson";

function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const from = route.query.from || "/";
  const { setAuth } = useAuth();
  const { toast } = useToast();
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
      toast({ description: "Login Successful" });
      router.push(from, { replace: true });
    },
    onError: (err) => {
      handleErrors(err, error, "Signing In");
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
      queryClient.invalidateQueries();
      // Note: You'll need to implement a toast notification system for Vue
      // toast.success("You have been successfully registered.");
      router.push("/login");
    },
    onError: (err) => {
      handleErrors(err, error, "Signing  Up");
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
      localStorage.removeItem("authState");
    },
    onError: (err) => {
      handleErrors(err, error, "Logging Out");
    },
  });
  return { error, logout };
}

function useCreateRoom() {
  const error = ref(null);
  const apiClientPrivate = useAxiosPrivate();
  const createRoom = useMutation({
    mutationFn: async (formData) => {
      try {
        console.log(formData);
        const res = await apiClientPrivate.post("/room/create", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: (err) => {
      handleErrors(err, error, "Creating Meeting");
    },
  });
  return { error, createRoom };
}

function useGetRooms() {
  const error = ref(null);
  const apiClientPrivate = useAxiosPrivate();
  const getRooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("/room/future");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onError: (err) => {
      handleErrors(err, error, "Fetching Rooms");
    },
  });
  return { error, getRooms };
}

function usePostJoinRoom() {
  const error = ref(null);
  const router = useRouter();
  const apiClientPrivate = useAxiosPrivate();
  const joinRoom = useMutation({
    mutationFn: async ({ rid, formData }) => {
      try {
        const res = await apiClientPrivate.post(`/room/join/${rid}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onError: (err) => {
      const response = err.response?.data;

      // Handle specific error cases
      switch (response?.error_code) {
        case "room_full":
          error.value =
            "This room has reached its maximum capacity of 10 members.";
          break;
        case "room_not_found":
          error.value = "The room you're trying to join does not exist.";
          break;
        case "private_room_access_denied":
          error.value =
            "This is a private room. You need an invitation to join.";
          break;
        default:
          error.value =
            "An error occurred while joining the room. Please try again.";
      }
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.value,
        variant: "destructive",
      });
      if (typeof window !== "undefined") {
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      }
    },
  });
  return { error, joinRoom };
}
const usePostAudioRecording = () => {
  const error = ref(null);
  const apiClientPrivate = useAxiosPrivate();
  const postAudioRecording = useMutation({
    mutationFn: async ({ rid, blob }) => {
      try {
        const formData = new FormData();
        formData.append("file", blob, "audio.wav");

        const res = await apiClientPrivate.post(
          `/room/upload/${rid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    onError: (err) => {
      const response = err.response?.data;

      // Handle specific error cases
      switch (response?.error_code) {
        case "room_full":
          error.value =
            "This room has reached its maximum capacity of 10 members.";
          break;
        case "room_not_found":
          error.value = "The room you're trying to join does not exist.";
          break;
        case "private_room_access_denied":
          error.value =
            "This is a private room. You need an invitation to join.";
          break;
        default:
          error.value =
            "An error occurred while joining the room. Please try again.";
      }
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.value,
        variant: "destructive",
      });
      if (typeof window !== "undefined") {
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      }
    },
  });
  return { error, postAudioRecording };
};

export {
  useSignup,
  useLogin,
  useLogout,
  useCreateRoom,
  useGetRooms,
  usePostJoinRoom,
  usePostAudioRecording,
};
