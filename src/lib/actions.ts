'use server';

import { revalidatePath } from 'next/cache';
import { addMessage, getFullConversationText } from './data';
import { translateMessages } from '@/ai/flows/translate-messages';
import { generateMedicalSummary } from '@/ai/flows/generate-medical-summary';

export async function sendTextMessageAction(formData: FormData) {
  const originalText = formData.get('originalText') as string;
  const userRole = formData.get('userRole') as 'Doctor' | 'Patient';
  const userLanguage = formData.get('userLanguage') as string;
  const otherLanguage = formData.get('otherLanguage') as string;
  const conversationId = formData.get('conversationId') as string;

  if (!originalText.trim()) {
    return;
  }

  // 1. Translate the message
  const translationResult = await translateMessages({
    text: originalText,
    sourceLanguage: userLanguage,
    targetLanguage: otherLanguage,
  });

  // 2. Add message to the mock database
  await addMessage({
    conversationId,
    senderRole: userRole,
    originalText,
    translatedText: translationResult.translatedText,
  });

  // 3. Revalidate the path to update the UI
  revalidatePath('/');
}

export async function sendAudioMessageAction(formData: FormData) {
  const audioBlob = formData.get('audio') as File;
  const senderRole = formData.get('senderRole') as 'Doctor' | 'Patient';
  const conversationId = formData.get('conversationId') as string;

  // For MVP, we simulate upload by converting to a base64 data URI.
  // This makes it persist in our mock DB for the session.
  const buffer = await audioBlob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const audioUrl = `data:${audioBlob.type};base64,${base64}`;

  // In a real app, you would also transcribe the audio to text here
  // and then translate it. For the MVP, we'll use a placeholder.
  // This is a known limitation mentioned in the README.
  const originalText = '[Audio Message]';
  const translatedText = '[Audio Message - Translated Placeholder]';

  await addMessage({
    conversationId,
    senderRole,
    originalText,
    translatedText,
    audioUrl,
  });

  revalidatePath('/');
}

export async function generateSummaryAction(conversationId: string) {
  // 1. Get the full conversation text
  const conversationText = await getFullConversationText(conversationId);

  if (!conversationText.trim()) {
    console.log('No conversation text to summarize.');
    return;
  }

  // 2. Call the AI flow to generate the summary
  const summary = await generateMedicalSummary({ conversationText });

  // 3. Add the summary as a special message to the chat
  await addMessage({
    conversationId,
    senderRole: 'Doctor', // or a system role
    isSummary: true,
    summaryContent: summary,
    originalText: 'Generated Medical Summary',
  });

  revalidatePath('/');
}
