import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "https://book-w.onrender.com/api/auth";

import { API_URL } from "../constants/api";

/* import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.backendUrl; */

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      await AsyncStorage.multiSet([
        ["user", JSON.stringify(data.user)],
        ["token", data.token],
      ]);

      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");

      await AsyncStorage.multiSet([
        ["user", JSON.stringify(data.user)],
        ["token", data.token],
      ]);

      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const [token, userJson] = await AsyncStorage.multiGet(["token", "user"]);
      const storedToken = token[1];
      const storedUser = userJson[1] ? JSON.parse(userJson[1]) : null;

      set({ token: storedToken, user: storedUser });
    } catch (error) {
      console.log("Auth check failed:", error);
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    set({ user: null, token: null });
  },
}));
