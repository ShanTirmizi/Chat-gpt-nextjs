import { ChatGPTChats, OpenAiStream } from '../../../lib/openAiStream';
import { chatListSchema } from '@/lib/validators/chat';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { chats, conversationId } = await req.json();

  const parseChats = chatListSchema.parse(chats);

  let conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        id: conversationId,
      },
    });
  }

  const outboundChats: ChatGPTChats[] = parseChats.map((chat) => ({
    role: chat.isUserInput ? 'user' : 'system',
    content: chat.text,
  }));

  outboundChats.unshift({
    role: 'system',
    content: 'Hello, I am a chatbot. How can I help you?',
  });

  // Create chat messages in the database
  for (const chat of outboundChats) {
    if (chat.content !== 'Hello, I am a chatbot. How can I help you?') {
      await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: chat.role,
          content: chat.content,
        },
      });
    }
  }

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: outboundChats,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };

  const stream = await OpenAiStream(payload, conversation.id);

  return new Response(stream);
}
