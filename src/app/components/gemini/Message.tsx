"use client";
import { MessageProps } from "@/app/types";
import { useEffect, useState } from "react";
import ImagePreview from "./ImagePreview";
import { Sparkles, User } from "lucide-react";
import { useThemeStore } from "@/app/store/themeStore";

const Message: React.FC<MessageProps> = ({ message, isTyping, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (message.role === "assistant" && isTyping && message.content) {
      const timer = setTimeout(() => {
        if (currentIndex < message.content.length) {
          setDisplayedText((prev) => prev + message.content[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else {
          onTypingComplete?.();
        }
      }, 30);

      return () => clearTimeout(timer);
    } else if (message.role === "user") {
      setDisplayedText(message.content);
    }
  }, [currentIndex, message.content, isTyping, message.role, onTypingComplete]);

  useEffect(() => {
    if (message.role === "assistant" && !isTyping) {
      setDisplayedText(message.content);
      setCurrentIndex(0);
    }
  }, [message.content, isTyping, message.role]);

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex items-start space-x-3 max-w-3xl ${
          message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          }`}
        >
          {message.role === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`p-4 rounded-2xl ${
            message.role === "user"
              ? "bg-blue-500 text-white"
              : isDark
              ? "bg-gray-800 text-gray-200"
              : "bg-gray-50 text-gray-800"
          }`}
        >
          {message.image && (
            <div className="mb-3">
              <ImagePreview
                src={message.image}
                alt="Shared image"
                className={
                  message.role === "user" ? "border-2 border-blue-300" : ""
                }
              />
            </div>
          )}
          {message.content && (
            <div className="whitespace-pre-wrap">{displayedText}</div>
          )}
          {isTyping && currentIndex < message.content.length && (
            <span
              className={`inline-block w-0.5 h-5 ml-1 animate-pulse ${
                isDark ? "bg-gray-500" : "bg-gray-400"
              }`}
            ></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
