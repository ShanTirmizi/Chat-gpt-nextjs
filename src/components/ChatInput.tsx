'use client';

import { ChatsContext } from '@/context/chats';
import { Chat } from '@/lib/validators/chat';
import { useMutation } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { FC, useContext, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ChatInputProps {
  conversationId: string;
}

const ChatInput: FC<ChatInputProps> = ({ conversationId }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { addChat, setIsChatUpdating, chats, updateChat, removeChat } =
    useContext(ChatsContext);

  const { mutate: sendChat, isLoading } = useMutation({
    mutationFn: async (allChats: Chat[]) => {
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chats: allChats, conversationId }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.body;
    },
    onMutate: (allChats: Chat[]) => {
      addChat(allChats[allChats.length - 1]);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error('No stream');

      const id = nanoid();
      const responseChat: Chat = {
        id,
        isUserInput: false,
        text: '',
      };

      addChat(responseChat);
      setIsChatUpdating(true);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        finished = done;
        const chunckValue = decoder.decode(value);
        updateChat(id, (prevText) => prevText + chunckValue);
      }
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
      setIsChatUpdating(false);
    },
    onError(_, allChats) {
      toast.error('Failed to send message');
      const newChat = allChats[allChats.length - 1];
      removeChat(newChat.id);
    },
  });
  return (
    <>
      <Toaster />
      <textarea
        className='w-full h-32 border border-gray-300 rounded-lg p-4 text-black'
        ref={textareaRef}
        placeholder='Type your message here...'
        value={input}
        disabled={isLoading}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const newChat = {
              id: nanoid(),
              isUserInput: true,
              text: input,
            };
            const allChats = [...chats, newChat]; // concatenate the existing chats with the new message
            sendChat(allChats);
            setInput('');
          }
        }}
      />
      <div className='flex justify-end'>
        {isLoading && (
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2'>
            ↺
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInput;
