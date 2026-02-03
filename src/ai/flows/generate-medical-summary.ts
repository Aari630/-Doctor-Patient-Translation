'use server';

/**
 * @fileOverview A medical summary generation AI agent.
 *
 * - generateMedicalSummary - A function that handles the generation of medical summaries from conversations.
 * - GenerateMedicalSummaryInput - The input type for the generateMedicalSummary function.
 * - GenerateMedicalSummaryOutput - The return type for the generateMedicalSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMedicalSummaryInputSchema = z.object({
  conversationText: z.string().describe('The complete text of the conversation between doctor and patient.'),
});
export type GenerateMedicalSummaryInput = z.infer<typeof GenerateMedicalSummaryInputSchema>;

const GenerateMedicalSummaryOutputSchema = z.object({
  symptoms: z.string().describe('A list of symptoms discussed in the conversation.'),
  diagnosis: z.string().describe('The diagnosis, if any, mentioned in the conversation.'),
  medications: z.string().describe('A list of medications mentioned in the conversation.'),
  followUp: z.string().describe('Recommended follow-up actions based on the conversation.'),
});
export type GenerateMedicalSummaryOutput = z.infer<typeof GenerateMedicalSummaryOutputSchema>;

export async function generateMedicalSummary(input: GenerateMedicalSummaryInput): Promise<GenerateMedicalSummaryOutput> {
  return generateMedicalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedicalSummaryPrompt',
  input: {schema: GenerateMedicalSummaryInputSchema},
  output: {schema: GenerateMedicalSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in generating medical summaries from doctor-patient conversations.  Your goal is to extract key medical information from the provided conversation text and present it in a structured format.

  Conversation Text: {{{conversationText}}}

  Instructions:
  1.  Analyze the conversation text to identify and extract the following information:
  *   Symptoms: List all symptoms discussed by the patient.
  *   Diagnosis: If a diagnosis is mentioned, state it clearly.
  *   Medications: List all medications mentioned, including dosages if available.
  *   Follow-up: Suggest any follow-up actions, such as further tests, specialist referrals, or return visits.

  2.  Present the extracted information in the following structured format:
  Symptoms:
  Diagnosis:
  Medications:
  Follow-up:
  `,
});

const generateMedicalSummaryFlow = ai.defineFlow(
  {
    name: 'generateMedicalSummaryFlow',
    inputSchema: GenerateMedicalSummaryInputSchema,
    outputSchema: GenerateMedicalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
