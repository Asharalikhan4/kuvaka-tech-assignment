export interface User {
  id: string;
  phone: string;
  countryCode: string;
  createdAt: Date;
}

export interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export interface MessageProps {
  message: Message;
  isTyping: boolean;
  onTypingComplete?: () => void;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // Base64 encoded image
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: Message;
  userId: string;
}

export interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  messages: Message[];
  isTyping: boolean;
  addChatroom: (chatroom: Omit<Chatroom, 'id' | 'createdAt'>) => void;
  deleteChatroom: (chatroomId: string) => void;
  setCurrentChatroom: (chatroom: Chatroom | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setIsTyping: (isTyping: boolean) => void;
  loadMoreMessages: (chatroomId: string) => void;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface ChatStore {
  chats: Chat[];
  activeChat: string | null;
  darkMode: boolean;
  createChat: () => string;
  setActiveChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageIndex: number, updates: Partial<Message>) => void;
  toggleDarkMode: () => void;
}

export interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  disabled?: boolean;
}