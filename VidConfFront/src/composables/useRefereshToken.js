import { apiClient } from "@/adapters/api";
import { useAuth } from "./useauth";

export function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await apiClient.get("users/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => ({
        ...prev,
        token: response.data.accessToken,
      }));
      return response.data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  return refresh;
}
