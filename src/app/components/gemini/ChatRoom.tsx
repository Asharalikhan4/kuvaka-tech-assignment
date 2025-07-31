import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Sparkles,
  X,
  Image,
  Menu,
} from "lucide-react";
import { dummyResponses, imageOnlyResponses } from "@/app/constants";
import { Chat, ImageUploadProps } from "@/app/types";
import TypingIndicator from "./TypingIndicator";
import ImagePreview from "./ImagePreview";
import Message from "./Message";
import ChatItem from "./ChatItem";
import { useChatStore } from "@/app/store/chatStore";
import { useThemeStore } from "@/app/store/themeStore";

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`p-2 rounded-lg ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
        title="Upload image"
      >
        <Image className="w-5 h-5 text-gray-500" />
      </button>
    </>
  );
};

const ChatRoom: React.FC = () => {
  const {
    chats,
    activeChat,
    createChat,
    setActiveChat,
    deleteChat,
    addMessage,
    updateMessage,
  } = useChatStore();

  const { isDark, toggleTheme } = useThemeStore();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentChat: Chat | undefined = chats.find(
    (chat) => chat.id === activeChat
  );

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, isAITyping, selectedImage]);

  // create default chat
  useEffect(() => {
    if (chats.length === 0) createChat();
  }, [chats.length, createChat]);

  // close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && !selectedImage) || !activeChat) return;

    const userMessage = {
      role: "user" as const,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      image: selectedImage || undefined,
    };

    addMessage(activeChat, userMessage);
    setInputMessage("");
    setSelectedImage(null);

    setIsAITyping(true);
    setTypingMessageIndex(-1);

    setTimeout(() => {
      const aiMessage = {
        role: "assistant" as const,
        content: "",
        timestamp: new Date().toISOString(),
      };

      addMessage(activeChat, aiMessage);
      const messageIndex = (currentChat?.messages?.length || 0) + 1;
      setTypingMessageIndex(messageIndex);

      setTimeout(() => {
        const responses =
          selectedImage || userMessage.image
            ? dummyResponses
            : userMessage.content
            ? dummyResponses
            : imageOnlyResponses;

        const response =
          responses[Math.floor(Math.random() * responses.length)];
        updateMessage(activeChat, messageIndex, { content: response });
      }, 800);
    }, 1200);
  };

  const handleTypingComplete = () => {
    setIsAITyping(false);
    setTypingMessageIndex(-1);
  };

  return (
    <div
      className={`flex h-screen transition-colors relative ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 w-64 border-r transform md:translate-x-0 transition-transform duration-300 z-20 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`p-4 border-b flex justify-between ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Chats
          </h2>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              createChat();
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg border ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setSidebarOpen(false);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <button
              className={`md:hidden p-2 rounded-lg ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu
                className={`w-5 h-5 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1
                className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Gemini AI
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Your AI assistant
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentChat?.messages?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Hello! I&apos;m Gemini
              </h2>
              <p
                className={`max-w-md ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                I can help with questions, analysis, creative tasks and more.
                Share text or images for better responses!
              </p>
            </div>
          ) : (
            <>
              {currentChat?.messages?.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  isTyping={isAITyping && typingMessageIndex === index}
                  onTypingComplete={handleTypingComplete}
                />
              ))}
              {isAITyping && typingMessageIndex === -1 && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className={`p-4 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <ImagePreview
                src={selectedImage}
                alt="Selected image"
                className="max-w-40 max-h-40"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <ImageUpload
                onImageSelect={setSelectedImage}
                disabled={isAITyping}
              />
            </div>
            <div className="flex-1 relative flex items-center">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message Gemini..."
                className={`w-full p-4 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
                rows={1}
                disabled={isAITyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isAITyping}
                className="absolute right-3 bottom-1/2 translate-y-1/2 w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p
            className={`text-xs text-center mt-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Press Enter to send, Shift+Enter for new line • Upload images with
            the icon
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
