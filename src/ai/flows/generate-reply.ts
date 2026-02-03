'use server';

/**
 * @fileOverview An AI agent that generates a reply in a conversation.
 *
 * - generateReply - A function that generates a reply from a given role.
 * - GenerateReplyInput - The input type for the generateReply function.
 * - GenerateReplyOutput - The return type for the generateReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReplyInputSchema = z.object({
  conversationText: z.string().describe('The history of the conversation so far.'),
  currentMessage: z.string().describe('The latest message that needs a reply.'),
  myRole: z.string().describe('The role of the user who sent the current message (e.g., Patient).'),
  otherRole: z.string().describe('The role of the user who should be replying (e.g., Doctor).'),
  otherLanguage: z.string().describe('The language the reply should be in.'),
});
export type GenerateReplyInput = z.infer<typeof GenerateReplyInputSchema>;

const GenerateReplyOutputSchema = z.object({
  replyText: z.string().describe('The generated reply text.'),
});
export type GenerateReplyOutput = z.infer<typeof GenerateReplyOutputSchema>;

export async function generateReply(input: GenerateReplyInput): Promise<GenerateReplyOutput> {
  return generateReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReplyPrompt',
  input: {schema: GenerateReplyInputSchema},
  output: {schema: GenerateReplyOutputSchema},
  prompt: `You are acting as a {{otherRole}} in a medical consultation with a {{myRole}}.
  Your response should be in {{otherLanguage}}.
  Keep your responses concise and natural for a chat conversation.

  Here is the conversation history:
  {{{conversationText}}}

  The {{myRole}} just said: "{{currentMessage}}"

  Generate a relevant and helpful reply from the perspective of the {{otherRole}}.
  `,
});

const generateReplyFlow = ai.defineFlow(
  {
    name: 'generateReplyFlow',
    inputSchema: GenerateReplyInputSchema,
    outputSchema: GenerateReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
