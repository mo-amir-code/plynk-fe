import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

export function redirectToGoogleAuth() {
  if (typeof window === "undefined") {
    return;
  }

  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");
  const endpoint = API_ENDPOINTS.AUTH.GOOGLE;

  window.location.assign(`${baseUrl}${endpoint}`);
}
