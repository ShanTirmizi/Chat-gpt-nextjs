'use client'

import { FC, useState } from 'react'

interface ChatInputProps {}

const ChatInput: FC<ChatInputProps>= () => {
  const [input, setInput] = useState('')
  return (
    <>
      <textarea className="w-full h-32 border border-gray-300 rounded-lg p-4 text-black"
        placeholder="Type your message here..."
        
      />

    </>
  )
}

export default ChatInput