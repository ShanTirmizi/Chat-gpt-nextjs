import { z } from 'zod'

export const chatSchema = z.object({
  id: z.string(),
  isUserInput: z.boolean(), 
  text: z.string(),
})

export const chatListSchema = z.array(chatSchema)

export type Chat = z.infer<typeof chatSchema>