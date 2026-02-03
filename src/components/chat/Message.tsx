'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/definitions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Pill, Stethoscope, User } from 'lucide-react';
import Highlight from './Highlight';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessageProps {
  message: Message;
  searchQuery: string;
}

const RoleAvatar = ({ role }: { role: string }) => {
  const isDoctor = role === 'Doctor';
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className={cn(isDoctor ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground')}>
        {isDoctor ? <Stethoscope className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
};

export function Message({ message, searchQuery }: MessageProps) {
  const { senderRole, originalText, translatedText, audioUrl, createdAt, isSummary, summaryContent } = message;
  const isDoctor = senderRole === 'Doctor';

  if (isSummary && summaryContent) {
    return (
      <Card className="my-4 mx-auto max-w-2xl bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            AI Medical Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Symptoms</h4>
            <p className="text-muted-foreground">{summaryContent.symptoms}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Diagnosis</h4>
            <p className="text-muted-foreground">{summaryContent.diagnosis}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Medications</h4>
            <p className="text-muted-foreground">{summaryContent.medications}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Follow-up</h4>
            <p className="text-muted-foreground">{summaryContent.followUp}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 my-4',
        isDoctor ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <RoleAvatar role={senderRole} />
      <div
        className={cn(
          'max-w-md rounded-lg p-3 text-sm lg:max-w-lg',
          isDoctor
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none bg-card border'
        )}
      >
        <div className="space-y-2">
          {originalText && (
            <div>
              <p className={cn("text-xs opacity-70", isDoctor ? 'text-primary-foreground' : 'text-muted-foreground')}>Original</p>
              <p className="font-code text-base">
                <Highlight text={originalText} highlight={searchQuery} />
              </p>
            </div>
          )}
          {translatedText && (
            <div>
              <p className={cn("text-xs opacity-70", isDoctor ? 'text-primary-foreground' : 'text-muted-foreground')}>Translated</p>
              <p className="text-base">
                <Highlight text={translatedText} highlight={searchQuery} />
              </p>
            </div>
          )}
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full h-10 my-2" />
          )}
        </div>
        <p className={cn("text-xs mt-2", isDoctor ? 'text-primary-foreground/70' : 'text-muted-foreground', 'text-right')}>
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
