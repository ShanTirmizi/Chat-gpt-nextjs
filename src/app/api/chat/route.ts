import { ChatGPTChats, OpenAiStream } from "../../../lib/openAiStream"
import { chatListSchema } from "@/lib/validators/chat"

export async function POST(req: Request) {
  const { chats } = await req.json()

  const parseChats = chatListSchema.parse(chats)

  const outboundChats: ChatGPTChats[] = parseChats.map((chat) => ({
    role: chat.isUserInput ? 'user' : 'system',
    content: chat.text,
  }))

  outboundChats.unshift({
    role: 'system',
    content: 'Hello, I am a chatbot. How can I help you?',
  })

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
  }

  const stream = await OpenAiStream(payload)

  return new Response(stream)
}