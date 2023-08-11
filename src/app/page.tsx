import ChatHistory from '@/components/ChatHistory';
import ChatComponent from '@/components/ChatComponent';
import Chats from '@/components/Chats';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-4xl font-bold text-center'>
        Welcome to your AI assistant
      </h1>
      <Chats />
      <ChatComponent />
      <ChatHistory />
    </main>
  );
}
