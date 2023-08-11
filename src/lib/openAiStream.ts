import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import prisma from '@/lib/prisma';

export type ChatGPTAgent = 'user' | 'system';

export interface ChatGPTChats {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAiStreamPayload {
  model: string;
  messages: ChatGPTChats[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export async function OpenAiStream(
  payload: OpenAiStreamPayload,
  conversationId: string
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      let currentMessageContent = ''; // The current message content
      async function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || '';

            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }

            currentMessageContent += text; // Append the text chunk to the current message

            // Check the finish_reason
            if (json.choices[0].finish_reason === 'stop') {
              const role: ChatGPTAgent = 'system';

              // Save the full message to the database
              await prisma.chatMessage.create({
                data: {
                  conversationId: conversationId,
                  role: role,
                  content: currentMessageContent, // No trim() here since we aren't relying on newlines anymore
                },
              });

              currentMessageContent = ''; // Reset for the next message
              counter++;
            }

            const queue = encoder.encode(text);
            controller.enqueue(queue);

            counter++;
          } catch (error) {
            controller.error(error);
          }
        }
      }
      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
