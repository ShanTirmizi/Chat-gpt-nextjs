import { Chat } from '@/lib/validators/chat';
import { nanoid } from 'nanoid';
import { createContext, useState, ReactNode } from 'react';

export const ChatsContext = createContext<{
  chats: Chat[];
  isChatUpdating: boolean;
  addChat: (chat: Chat) => void;
  removeChat: (id: string) => void;
  updateChat: (id: string, updateFn: (prevText: string) => string) => void;
  setIsChatUpdating: (isUpdating: boolean) => void;
}>({
  chats: [],
  isChatUpdating: false,
  addChat: () => {},
  removeChat: () => {},
  updateChat: () => {},
  setIsChatUpdating: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)
  const [chats, setChats] = useState<Chat[]>([
    {
      id: nanoid(),
      isUserInput: false,
      text: 'Hello, how can I help you?',
    },
  ])

  const addChat = (chat: Chat) => {
    setChats((prevChats) => [...prevChats, chat])
  }

  const removeChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id))
  }

  const updateChat = (id: string, updateFn: (prevText: string) => string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, text: updateFn(chat.text) } : chat
      )
    )
  }

  return (
    <ChatsContext.Provider value={{
      chats,
      isChatUpdating,
      setIsChatUpdating,
      addChat,
      removeChat,
      updateChat,
    }}>{children}</ChatsContext.Provider>
  )
}