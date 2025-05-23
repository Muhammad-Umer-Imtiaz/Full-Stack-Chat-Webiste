import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Base_URL =import.meta.env.MODE === "development" ?"http://localhost:3000" :"/api";

const jsonHeaders = {
  "Content-Type": "application/json",
};

const formHeaders = {
  "Content-Type": "multipart/form-data",
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axios.get(`${Base_URL}/api/v1/user/check`, {
        withCredentials: true,
        headers: jsonHeaders,
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Check Auth Error:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${Base_URL}/api/v1/user/signup`, data, {
        withCredentials: true,
        headers: formHeaders,
      });
      set({ authUser: res.data });
      toast.success(res.data.message || "Signup successful");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(`${Base_URL}/api/v1/user/login`, formData, {
        withCredentials: true,
        headers: jsonHeaders,
      });

      set({ authUser: res.data.user });
      get().connectSocket();

      toast.success(`Welcome back, ${res.data.user.userName}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const { socket } = get();

      if (socket) {
        socket.emit("userDisconnected");
        socket.disconnect();
      }

      await axios.get(`${Base_URL}/api/v1/user/logout`, {
        withCredentials: true,
        headers: jsonHeaders,
      });

      set({
        authUser: null,
        socket: null,
        onlineUsers: [],
      });

      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
      return false;
    }
  },

  profile: async () => {
    try {
      const res = await axios.get(`${Base_URL}/api/v1/user/profile`, {
        withCredentials: true,
        headers: jsonHeaders,
      });
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      console.error("Profile Error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put(`${Base_URL}/api/v1/user/update-profile`, data, {
        withCredentials: true,
        headers: formHeaders,
      });
      set({ authUser: res.data });
      toast.success(res.data.message || "Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePassword: async (data) => {
    try {
      const res = await axios.put(`${Base_URL}/api/v1/user/update-password`, data, {
        withCredentials: true,
        headers: jsonHeaders,
      });
      toast.success(res.data.message || "Password updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    try {
      const newSocket = io(Base_URL, {
        query: { userId: authUser._id },
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        newSocket.emit("userConnected", authUser._id);
      });

      newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });

      newSocket.on("disconnect", () => {
        set({ socket: null });
      });

      set({ socket: newSocket });
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  updateOnlineUsers: (users) => set({ onlineUsers: users }),
}));
