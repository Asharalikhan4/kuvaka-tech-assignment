"use client";
import { ChatItemProps } from "@/app/types";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "@/app/store/themeStore";

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, onClick, onDelete }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { isDark } = useThemeStore();

  return (
    <div
      className={`relative group rounded-lg mb-2 transition-colors ${
        isActive
          ? isDark
            ? "bg-blue-900/30 text-blue-200 border border-blue-700"
            : "bg-blue-100 text-blue-800 border border-blue-200"
          : isDark
          ? "hover:bg-gray-800"
          : "hover:bg-gray-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className="w-full text-left p-3 rounded-lg"
      >
        <div className="flex items-center space-x-3 pr-8">
          <MessageSquare
            className={`w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div
              className={`font-medium text-sm truncate ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {chat.title || "New Chat"}
            </div>
            <div
              className={`text-xs mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {chat.messages.length} messages
            </div>
          </div>
        </div>
      </button>

      {(isHovered || isActive) && (
        <button
          onClick={onDelete}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? "bg-gray-700 hover:bg-red-800"
              : "bg-gray-200 hover:bg-red-200"
          }`}
        >
          <X
            className={`w-3 h-3 ${
              isDark
                ? "text-gray-300 hover:text-red-400"
                : "text-gray-600 hover:text-red-600"
            }`}
          />
        </button>
      )}
    </div>
  );
};

export default ChatItem;
