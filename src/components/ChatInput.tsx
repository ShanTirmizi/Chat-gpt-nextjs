'use client'

import { Chat } from '@/lib/validators/chat'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { FC, useState } from 'react'

interface ChatInputProps {}

const ChatInput: FC<ChatInputProps>= () => {
  const [input, setInput] = useState('')

  const {mutate: sendChat, isLoading} = useMutation({
    mutationFn: async (chat: Chat) => {
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chats: 'Hello world' })
      })
      return response.body
    },
    onSuccess: () => {
      console.log('success')
    },
  })
  return (
    <>
      <textarea className="w-full h-32 border border-gray-300 rounded-lg p-4 text-black"
        placeholder="Type your message here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()

            const chat = {
              id: nanoid(),
              isUserInput: true,
              text: input,
            }
            sendChat(chat)
          }
        }}

      />

    </>
  )
}

export default ChatInput