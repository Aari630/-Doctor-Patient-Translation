# MediTranslate MVP

## Project Overview

MediTranslate is an MVP web application designed to bridge communication gaps between doctors and patients who speak different languages. It provides near real-time translation of text and audio messages within a familiar chat interface. The application also leverages AI to generate concise medical summaries from conversation logs, aiding in clinical documentation and patient understanding.

This project was built as a 12-hour take-home assignment, prioritizing core functionality and a clean, deployable architecture over extensive features and polish.

## Features Completed

*   **Role & Language Selection**: Users can select their role (Doctor or Patient) and preferred language at the start of the session.
*   **Text Chat Interface**: A responsive, WhatsApp-like UI clearly distinguishes between messages from the Doctor and the Patient.
*   **Near Real-Time Text Translation**: Text messages are translated to the other user's preferred language using an AI model. Both the original and translated text are displayed.
*   **Audio Messaging**: Users can record audio messages directly in the browser. These messages are playable within the chat.
*   **Conversation Logging**: The entire conversation, including text, translations, and audio, is persisted for the session. The chat state reloads on browser refresh.
*   **Conversation Search**: A search bar allows users to filter the conversation and highlights matching keywords in messages.
*   **AI-Powered Medical Summary**: A "Generate Medical Summary" button analyzes the conversation and produces a structured summary including:
    *   Symptoms
    *   Diagnosis
    *   Medications
    *   Follow-up actions

## Tech Stack

*   **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui
*   **Backend**: Next.js (Server Actions)
*   **Database**: Mocked in-memory data store (to simulate Supabase/Postgres persistence for the MVP).
*   **AI**: Firebase Genkit with Google's Gemini models.
*   **Audio**: Browser MediaRecorder API.
*   **Deployment**: Vercel.

## AI Tools & Prompts

This project utilizes two core AI flows managed by Genkit:

1.  **`translateMessages`**:
    *   **Purpose**: Translates a given text from a source language to a target language.
    *   **Prompt Strategy**: The prompt instructs the model to act as a translation expert, ensuring high accuracy and preservation of intent, which is critical for medical conversations.

2.  **`generateMedicalSummary`**:
    *   **Purpose**: Analyzes a full conversation transcript and extracts key medical information.
    *   **Prompt Strategy**: The prompt provides a clear structure for the desired output (Symptoms, Diagnosis, Medications, Follow-up), guiding the model to return a well-formatted and predictable JSON object.

## Known Limitations & Future Work

Given the time constraints, this MVP has several limitations that would be addressed in a production environment:

*   **No Real Database**: Conversation persistence is mocked in-memory. The next step would be to integrate a real Supabase Postgres database using the provided `schema.sql`.
*   **No User Authentication**: The session is anonymous. A full user authentication system would be required to manage multiple distinct conversations and user data securely.
*   **Audio Translation**: Audio messages are recorded and stored, but not transcribed and translated. This would require integrating a Speech-to-Text API (like OpenAI's Whisper) into the audio processing pipeline.
*   **Simplified State Management**: User roles and language selections are stored in React state and do not persist across different browser sessions.
*   **No Real-time Subscription**: The chat does not update in real-time for the other user. It relies on the current user's actions to re-fetch data. A production app would use WebSockets or Supabase Realtime for a true live chat experience.

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your AI provider API keys.
    ```
    GOOGLE_API_KEY=your_google_ai_api_key
    ```

4.  **Run the Genkit development server (for AI flows):**
    In a separate terminal, run:
    ```bash
    npm run genkit:watch
    ```

5.  **Run the Next.js development server:**
    ```bash
    npm run dev
    ```

6.  **Open the application:**
    Navigate to `http://localhost:9002` in your browser.

## Deployment

This application is configured for seamless deployment to Vercel.

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Import the project on Vercel.**
3.  **Configure Environment Variables**: In the Vercel project settings, add the same environment variables from your `.env.local` file (e.g., `GOOGLE_API_KEY`).
4.  **Deploy**. Vercel will automatically detect the Next.js framework and build/deploy the application.
