// src/ai/flows/translate-messages.ts
'use server';
/**
 * @fileOverview A message translation AI agent.
 *
 * - translateMessages - A function that handles the message translation process.
 * - TranslateMessagesInput - The input type for the translateMessages function.
 * - TranslateMessagesOutput - The return type for the translateMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateMessagesInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The language of the text to translate.'),
  targetLanguage: z.string().describe('The language to translate the text into.'),
});
export type TranslateMessagesInput = z.infer<typeof TranslateMessagesInputSchema>;

const TranslateMessagesOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateMessagesOutput = z.infer<typeof TranslateMessagesOutputSchema>;

export async function translateMessages(input: TranslateMessagesInput): Promise<TranslateMessagesOutput> {
  return translateMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateMessagesPrompt',
  input: {schema: TranslateMessagesInputSchema},
  output: {schema: TranslateMessagesOutputSchema},
  prompt: `You are a translation expert.

You will translate the provided text from the source language to the target language.

Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}
Text to translate: {{{text}}}`,
});

const translateMessagesFlow = ai.defineFlow(
  {
    name: 'translateMessagesFlow',
    inputSchema: TranslateMessagesInputSchema,
    outputSchema: TranslateMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
