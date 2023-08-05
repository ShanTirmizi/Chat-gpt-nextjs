'use client'

import { FC, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChatProvider } from "@/context/chats"

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps>= ({ children }) => {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}><ChatProvider>{children}</ChatProvider></QueryClientProvider>
}

export default Providers