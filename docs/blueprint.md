# **App Name**: MediTranslate

## Core Features:

- Role Selection: Allows users to select either 'Doctor' or 'Patient' role and their preferred language upon entering the application.
- Real-Time Translation: Translates text and audio messages between users in near real-time, displaying both the original and translated text. Uses OpenAI's API to translate messages between users with different preferred languages. It is intended that the LLM will tool-use the messages.
- Text Chat Interface: Provides a WhatsApp-like chat interface with clear visual distinction between Doctor and Patient messages. Mobile responsive design is included.
- Audio Recording & Playback: Enables users to record audio directly from the browser, upload it to Supabase Storage, and play back the audio within the chat interface.
- Conversation Logging: Persists messages, translations, audio URLs, and timestamps in the Supabase database. Reloads conversation data on refresh to maintain continuity. Uses SQL database to maintain a history of conversations.
- Conversation Search: Allows users to search across messages using keywords and highlights the matched text within the conversation log.
- AI-Powered Medical Summary: Generates a structured medical summary, including symptoms, diagnosis, medications, and follow-up actions, using OpenAI based on the conversation content. It is intended that the LLM will tool-use the messages.

## Style Guidelines:

- Primary color: Soft blue (#90AFC5) to evoke calmness and trust, suitable for a healthcare setting.
- Background color: Light gray (#E9ECEF), providing a clean and neutral backdrop.
- Accent color: Pale violet (#B19CD9) for interactive elements and highlights.
- Body and headline font: 'Inter' sans-serif font providing a modern and neutral look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use a set of simple, professional icons sourced from a consistent set to represent various functions and content types.
- Subtle, non-intrusive animations for loading states and transitions to provide a smooth user experience.