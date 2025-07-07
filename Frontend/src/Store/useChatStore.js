import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const Base_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/api";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  // ✅ Fetch all users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get(`${Base_URL}/api/v1/message/user`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ Fetch messages of selected user
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axios.get(`${Base_URL}/api/v1/message/${userId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageDate) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `${Base_URL}/api/v1/message/sendmessage/${selectedUser._id}`,
        messageDate,
        {
          withCredentials: true,
        }
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },
  SubscribeToMessage: () => {
    const { selectedUser } = get();

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unSubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  // ✅ Select a user for chat
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
