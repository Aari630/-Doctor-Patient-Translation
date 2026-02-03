'use client';

import { useEffect, useRef } from 'react';
import type { Message as MessageType } from '@/lib/definitions';
import { Message } from './Message';

interface MessageListProps {
  messages: MessageType[];
  searchQuery: string;
}

export function MessageList({ messages, searchQuery }: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} searchQuery={searchQuery} />
        ))
      ) : (
        <div className="text-center text-muted-foreground mt-8">
          <p>No messages yet.</p>
          <p>Start the conversation!</p>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
