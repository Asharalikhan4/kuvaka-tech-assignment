"use client";
import { Sparkles } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";

const TypingIndicator: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div
        className={`flex items-center space-x-2 p-4 rounded-2xl max-w-xs ${
          isDark ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="flex space-x-1">
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? "bg-gray-500" : "bg-gray-400"
            }`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? "bg-gray-500" : "bg-gray-400"
            }`}
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? "bg-gray-500" : "bg-gray-400"
            }`}
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        <span
          className={`text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Gemini is typing...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
