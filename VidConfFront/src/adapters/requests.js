import { apiClient, queryClient } from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useToast } from "@/components/ui/use-toast";
import { handleErrors } from "@/utils/handleErrors";
import { handleError } from "./utils";

function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState(null);

  return useMutation({
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
      navigate(from, { replace: true });
    },
    onError: (err) => {
      handleErrors(err, setError, "Signing In", toast);
      if (axios.isAxiosError(err) && err.response) {
        const { data } = err.response;
        if (data && data.error_code === "invalid_email_or_password") {
          setError("invalid mail or password");
        } else if (data && data.error_code === "account_not_verified") {
          setError("Account not Verified \n check mail for details");
        } else {
          setError(data.error_code || "An error occurred during login");
        }
      } else {
        setError("An unexpected error occurred");
      }
    },
  });
}

function useSignup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { toast } = useToast();

  return useMutation({
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
        setError("Invalid response from server");
        return;
      }
      queryClient.invalidateQueries();
      // Add toast notification if you have a toast system
      // toast.success("You have been successfully registered.");
      navigate("/login");
    },
    onError: (err) => {
      handleErrors(err, setError, "Signing Up", toast);
    },
  });
}

function useLogout() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();
  const apiClientPrivate = useAxiosPrivate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      try {
        const res = await apiClientPrivate.get("/auth/logout");
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      setAuth({});
      queryClient.invalidateQueries();
      navigate("/", { replace: true });
      localStorage.removeItem("authState");
    },
    onError: (err) => {
      handleErrors(err, setError, "Logging Out", toast);
    },
  });
}

function useCreateRoom() {
  const [error, setError] = useState(null);
  const apiClientPrivate = useAxiosPrivate();
  const { toast } = useToast();

  return useMutation({
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
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: (err) => {
      handleErrors(err, setError, "Creating Meeting", toast);
    },
  });
}

function useGetRooms() {
  const apiClientPrivate = useAxiosPrivate();

  const { toast } = useToast();
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("/room/future");
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onError: (err) => {
      handleErrors(err, setError, "Fetching Rooms", toast);
    },
  });
}

function usePostJoinRoom() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiClientPrivate = useAxiosPrivate();
  const { toast } = useToast();

  return useMutation({
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
        throw error;
      }
    },
    onError: (err) => {
      const response = err.response?.data;

      // Handle specific error cases
      switch (response?.error_code) {
        case "room_full":
          setError("This room has reached its maximum capacity of 10 members.");
          break;
        case "room_not_found":
          setError("The room you're trying to join does not exist.");
          break;
        case "private_room_access_denied":
          setError("This is a private room. You need an invitation to join.");
          break;
        case "room_not_started":
          setError(
            `room has not started it starts at ${response?.starting_time}`,
          );
          break;
        case "room_closed":
          setError(
            `the room is closed, it cloased at ${response?.closing_time}`,
          );
          break;

        default:
          setError(
            "An error occurred while joining the room. Please try again.",
          );
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: error,
        variant: "destructive",
      });

      if (typeof window !== "undefined") {
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      }
    },
  });
}

function usePostAudioRecording() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiClientPrivate = useAxiosPrivate();
  const { toast } = useToast();

  return useMutation({
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
        throw error;
      }
    },
    onError: (err) => {
      // Handle specific error cases
      handleErrors(err, setError, "Uploading Audio", toast);
    },
  });
}
function useStreamToken() {
  const apiClientPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClientPrivate.post("/external/stream/token");
      return response.data;
    },
    onError: (err) => {
      handleErrors(err, setError, "Fetching Rooms", toast);
    },
  });
}

function useAssemblyToken() {
  const apiClientPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const { toast } = useToast();
  return useQuery({
    queryKey: ["assembly-token"],
    queryFn: async () => {
      try {
        const res = await apiClientPrivate.get("/external/assembly/token");
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onError: (err) => {
      handleErrors(err, setError, "Fetching Rooms", toast);
    },
  });
}
function useLemur() {
  const apiClientPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (prompt) => {
      const response = await apiClientPrivate.post(
        "/external/lemur",
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    onError: (err) => {
      handleError(err, setError, "lemur", toast);
    },
  });
}

export {
  useSignup,
  useLogin,
  useLogout,
  useCreateRoom,
  useGetRooms,
  usePostJoinRoom,
  usePostAudioRecording,
  useStreamToken,
  useAssemblyToken,
  useLemur,
};
