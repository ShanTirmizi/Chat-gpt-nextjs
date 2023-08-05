'use client';

import { ChatsContext } from '@/context/chats';
import { useContext } from 'react';

const Chats = () => {
  const { chats } = useContext(ChatsContext);
  const reveaseChats = [...chats].reverse();
  return (
    <div className='flex flex-col-reverse'>
      {reveaseChats.map((chat) => (
        <div key={chat.id} className='flex justify-end'>
          <div
            className={`rounded-lg p-4 m-2 ${
              chat.isUserInput ? 'bg-purple-400' : 'bg-white text-black'
            }`}
          >
            {chat.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
