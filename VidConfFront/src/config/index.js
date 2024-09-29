export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  IS_DEMO: Boolean(import.meta.env.VITE_IS_DEMO),
};
