'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sendTextMessageAction } from '@/lib/actions';
import type { Role, Language } from '@/lib/definitions';
import { AudioRecorder } from './AudioRecorder';
import { Loader2, Send } from 'lucide-react';

interface MessageInputProps {
  userRole: Role;
  userLanguage: Language;
  otherLanguage: Language;
  conversationId: string;
}

export function MessageInput({ userRole, userLanguage, otherLanguage, conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = (formData: FormData) => {
    startTransition(async () => {
      await sendTextMessageAction(formData);
      setText('');
    });
  };

  return (
    <form action={handleSendMessage} className="flex items-start gap-4">
      <input type="hidden" name="userRole" value={userRole} />
      <input type="hidden" name="userLanguage" value={userLanguage.code} />
      <input type="hidden" name="otherLanguage" value={otherLanguage.code} />
      <input type="hidden" name="conversationId" value={conversationId} />
      
      <Textarea
        name="originalText"
        placeholder="Type a message or record audio..."
        className="flex-1 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) {
                const form = e.currentTarget.closest('form');
                if (form) {
                    handleSendMessage(new FormData(form));
                }
            }
          }
        }}
        rows={1}
        disabled={isPending}
      />
      <div className="flex items-center gap-2">
        <AudioRecorder userRole={userRole} conversationId={conversationId} />
        <Button type="submit" size="icon" disabled={!text.trim() || isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send Message</span>
        </Button>
      </div>
    </form>
  );
}
