import type { Message } from './definitions';

// In-memory store for messages to simulate a database for the MVP
let messages: Message[] = [
  {
    id: 'msg-1',
    conversationId: '1',
    senderRole: 'Patient',
    originalText: 'Hello doctor, I have been having a headache for the past 3 days.',
    translatedText: 'Hola doctor, he tenido dolor de cabeza durante los últimos 3 días.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'msg-2',
    conversationId: '1',
    senderRole: 'Doctor',
    originalText: 'Hello. Can you describe the headache? Is it a sharp pain or a dull ache?',
    translatedText: 'Hola. ¿Puede describir el dolor de cabeza? ¿Es un dolor agudo o sordo?',
    createdAt: new Date(Date.now() - 1000 * 60 * 4),
  },
];

// Use a fixed conversation ID for the MVP
const CONVERSATION_ID = '1';

/**
 * Fetches all messages for the conversation.
 * @param conversationId - The ID of the conversation (ignored in this mock, uses a fixed ID).
 * @returns A promise that resolves to an array of messages.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  // Filter messages for the given conversationId (always '1' in this mock)
  return Promise.resolve(messages.filter(m => m.conversationId === conversationId));
}

/**
 * Adds a new message to our in-memory store.
 * @param message - The message data to add, without 'id' and 'createdAt'.
 * @returns A promise that resolves to the newly created message.
 */
export async function addMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    createdAt: new Date(),
  };
  messages.push(newMessage);
  return Promise.resolve(newMessage);
}

/**
 * Retrieves the full conversation text formatted for the AI summary.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to a single string of the conversation.
 */
export async function getFullConversationText(conversationId: string): Promise<string> {
    const conversationMessages = messages.filter(
        (msg) => msg.conversationId === conversationId && !msg.isSummary && msg.originalText
    );

    const formattedText = conversationMessages
        .map(msg => `${msg.senderRole}: ${msg.originalText}`)
        .join('\n');
        
    return Promise.resolve(formattedText);
}
