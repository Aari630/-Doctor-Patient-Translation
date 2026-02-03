'use client';

import { Mic, Square, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { sendAudioMessageAction } from '@/lib/actions';
import type { Role } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  userRole: Role;
  conversationId: string;
}

export function AudioRecorder({ userRole, conversationId }: AudioRecorderProps) {
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopped'>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordingStatus('recording');
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingStatus('stopped');
        audioChunksRef.current = [];
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access the microphone. Please check permissions and try again.',
      });
      setRecordingStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('senderRole', userRole);
    formData.append('conversationId', conversationId);

    try {
      await sendAudioMessageAction(formData);
      resetRecording();
    } catch (error) {
      console.error('Failed to send audio message:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not send the audio message.',
      });
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingStatus('idle');
  };

  useEffect(() => {
    // Cleanup URL object on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (recordingStatus === 'recording') {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={stopRecording} variant="destructive" size="icon">
          <Square className="h-4 w-4" />
          <span className="sr-only">Stop Recording</span>
        </Button>
        <div className="flex items-center gap-2 text-sm text-destructive">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse"></div>
          Recording...
        </div>
      </div>
    );
  }

  if (recordingStatus === 'stopped' && audioUrl) {
    return (
      <div className="flex w-full items-center gap-2">
        <audio src={audioUrl} controls className="flex-grow rounded-md" />
        <Button onClick={resetRecording} variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Recording</span>
        </Button>
        <Button onClick={handleSendAudio} variant="default">
          Send Audio
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={startRecording} variant="outline" size="icon" aria-label="Record audio">
      <Mic className="h-4 w-4" />
    </Button>
  );
}
