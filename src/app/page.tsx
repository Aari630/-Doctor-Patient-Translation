import ChatLayout from '@/components/chat/ChatLayout';
import { getMessages } from '@/lib/data';

export default async function Home() {
  // For this MVP, we use a fixed conversation ID "1"
  const initialMessages = await getMessages('1');

  return (
    <main className="flex h-svh flex-col bg-background">
      <ChatLayout initialMessages={initialMessages} />
    </main>
  );
}
