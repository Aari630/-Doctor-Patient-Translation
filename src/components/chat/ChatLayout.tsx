'use client';

import { useState, useEffect } from 'react';
import type { Message, Role, Language } from '@/lib/definitions';
import { supportedLanguages } from '@/lib/definitions';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoleSelector } from './RoleSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSummaryAction } from '@/lib/actions';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../Logo';

interface ChatLayoutProps {
  initialMessages: Message[];
}

export default function ChatLayout({ initialMessages }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userLanguage, setUserLanguage] = useState<Language | null>(null);
  const [otherRole, setOtherRole] = useState<Role | null>(null);
  const [otherLanguage, setOtherLanguage] = useState<Language | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const { toast } = useToast();

  const conversationId = '1'; // Fixed for MVP

  const handleSelectRole = (role: Role, language: Language) => {
    setUserRole(role);
    setUserLanguage(language);
    const other = role === 'Doctor' ? 'Patient' : 'Doctor';
    setOtherRole(other);
    // For MVP, auto-assign a different language to the other role
    const otherLang = supportedLanguages.find(l => l.code !== language.code) || supportedLanguages[1];
    setOtherLanguage(otherLang);
    setShowRoleSelector(false);
  };
  
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    try {
      await generateSummaryAction(conversationId);
      // The new message will be added via revalidation
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Summary Failed',
        description: 'Could not generate the medical summary.',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (showRoleSelector || !userRole || !userLanguage || !otherLanguage) {
    return <RoleSelector onSelect={handleSelectRole} />;
  }

  const filteredMessages = messages.filter(
    (msg) =>
      !searchQuery ||
      msg.originalText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.translatedText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-secondary/50 p-4">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="relative w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversation..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateSummary} disabled={isSummaryLoading}>
            {isSummaryLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span className="ml-2 hidden md:inline">Generate Medical Summary</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <MessageList messages={filteredMessages} searchQuery={searchQuery} />
      </div>
      <footer className="border-t bg-secondary/50 p-4">
        <MessageInput
          userRole={userRole}
          userLanguage={userLanguage}
          otherLanguage={otherLanguage}
          conversationId={conversationId}
        />
      </footer>
    </div>
  );
}
