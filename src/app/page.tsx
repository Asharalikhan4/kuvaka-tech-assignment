"use client";
import { Toaster } from "sonner";
import { AuthForm } from "./components/auth/AuthForm";
import { useAuthStore } from "./store/authStore";
import ChatRoom from "./components/gemini/ChatRoom";
import { useThemeStore } from "./store/themeStore";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { isDark } = useThemeStore();

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br 
        ${isDark ? "from-slate-900 to-slate-800" : "from-slate-50 to-slate-100"}`}
      >
        <AuthForm />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return <ChatRoom />;
}
