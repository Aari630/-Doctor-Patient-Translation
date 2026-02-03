-- Users table to store role and language preference
-- In a full application, this would be linked to an authentication system.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- For this MVP, role and language are managed on the client,
    -- but this schema represents a persistent multi-user setup.
    role VARCHAR(255) NOT NULL CHECK (role IN ('Doctor', 'Patient')),
    language VARCHAR(255) NOT NULL
);

-- Conversations table to group messages
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table to log all interactions
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_role VARCHAR(255) NOT NULL CHECK (sender_role IN ('Doctor', 'Patient')),
    original_text TEXT,
    translated_text TEXT,
    audio_url VARCHAR(2048), -- URL to audio file in Supabase Storage
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Special flag for AI-generated summary messages
    is_summary BOOLEAN DEFAULT FALSE,
    summary_content JSONB -- Store structured summary data
);

-- Indexes for performance
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- A full-text search index would be highly beneficial for the search feature in a production environment.
-- CREATE INDEX idx_messages_text_search ON messages USING gin(to_tsvector('english', original_text || ' ' || translated_text));
