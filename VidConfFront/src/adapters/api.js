import axios from "axios";
import { QueryClient } from "@tanstack/vue-query";
import { config } from "../config";
const baseURL = config.API_URL;
const apiClient = axios.create({
  baseURL: `${baseURL}`,
});

const apiClientPrivate = axios.create({
  baseURL: `${baseURL}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
const queryClient = new QueryClient();

export { apiClient, queryClient, apiClientPrivate };
