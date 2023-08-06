'use client';

import ChatInput from './ChatInput';
import { useState } from 'react';
import { nanoid } from 'nanoid';

const ChatComponent = () => {
  const [conversationId] = useState(nanoid());

  return <ChatInput conversationId={conversationId} />;
};

export default ChatComponent;
