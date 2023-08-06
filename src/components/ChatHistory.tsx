'use client';

import { useQuery } from '@tanstack/react-query';

interface ChatProps {
  id: string;
  content: string;
  isUserInput: boolean;
}

interface ConversationProps {
  id: string;
  messages: ChatProps[];
}
const ChatHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const respose = await fetch('/api/conversation');
      if (!respose.ok) throw new Error('Failed to fetch conversations');
      return respose.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col-reverse'>
      {data &&
        data.map((conversation: ConversationProps) => (
          <div key={conversation.id}>
            {conversation.messages.map((chat: ChatProps) => (
              <div key={chat.id} className='flex justify-end'>
                <div
                  className={`rounded-lg p-4 m-2 ${
                    chat.isUserInput ? 'bg-purple-400' : 'bg-white text-black'
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default ChatHistory;
