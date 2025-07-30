import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat, ChatStore, Message } from "../types";

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      darkMode: false,

      createChat: (): string => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: "New Chat",
          messages: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChat: newChat.id,
        }));
        return newChat.id;
      },

      setActiveChat: (chatId: string) => {
        set({ activeChat: chatId });
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const updatedChats = state.chats.filter((chat) => chat.id !== chatId);
          const newActiveChat =
            state.activeChat === chatId
              ? updatedChats.length > 0
                ? updatedChats[0].id
                : null
              : state.activeChat;

          return {
            chats: updatedChats,
            activeChat: newActiveChat,
          };
        });
      },

      addMessage: (chatId: string, message: Message) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  title:
                    chat.messages.length === 0
                      ? message.content.slice(0, 30) + "..."
                      : chat.title,
                }
              : chat,
          ),
        }));
      },

      updateMessage: (
        chatId: string,
        messageIndex: number,
        updates: Partial<Message>,
      ) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, idx) =>
                    idx === messageIndex ? { ...msg, ...updates } : msg,
                  ),
                }
              : chat,
          ),
        }));
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },
    }),
    {
      name: "gemini-chats",
    },
  ),
);