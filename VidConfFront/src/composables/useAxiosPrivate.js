import { onMounted, onUnmounted } from "vue";
import { useRefreshToken } from "./useRefreshToken";
import { useAuth } from "./useauth";
import { apiClientPrivate } from "@/adapters/api";

export function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  let requestIntercept = null;
  let responseIntercept = null;

  onMounted(() => {
    requestIntercept = apiClientPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.value?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    responseIntercept = apiClientPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            if (!newAccessToken) {
              setAuth({});
              return Promise.reject(error);
            }
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return apiClientPrivate(prevRequest);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            setAuth({});
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
  });

  onUnmounted(() => {
    apiClientPrivate.interceptors.request.eject(requestIntercept);
    apiClientPrivate.interceptors.response.eject(responseIntercept);
  });

  return apiClientPrivate;
}
