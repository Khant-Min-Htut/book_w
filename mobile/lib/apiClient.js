// lib/apiClient.js
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../constants/api";

// ✅ Universal API wrapper
export const apiClient = async (endpoint, options = {}) => {
  const token = useAuthStore.getState().token;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ API error:", data);
    throw new Error(data.message || "API request failed");
  }

  return data;
};
