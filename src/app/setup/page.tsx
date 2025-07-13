'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Copy, Check, Database, Upload, Zap } from 'lucide-react'

const SQL_SCRIPTS = {
  schema: `-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level, "order")
);

-- Create exercises table
CREATE TABLE exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'fill-in-the-blank', 'word-puzzle', 'audio-quiz', 'sentence-builder', 'reading', 'dialog', 'speech-practice')),
    content_json JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 10,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, "order")
);

-- Create user_progress table
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- Create flashcards table
CREATE TABLE flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    word_en TEXT NOT NULL,
    word_ru TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_lessons_level ON lessons(level);
CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_flashcards_level ON flashcards(level);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Everyone can read lessons and exercises (they are public content)
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Anyone can view flashcards" ON flashcards FOR SELECT USING (true);

-- Users can only see and modify their own progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid()::text = user_id::text);`,

  storage: `-- Create storage buckets for media files

-- Create audio bucket for exercise audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);

-- Create images bucket for flashcard images and other visual content
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for audio bucket
CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Authenticated users can upload audio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update audio files" ON storage.objects FOR UPDATE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete audio files" ON storage.objects FOR DELETE USING (bucket_id = 'audio' AND auth.role() = 'authenticated');

-- Create storage policies for images bucket
CREATE POLICY "Anyone can view image files" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload image files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update image files" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete image files" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');`,

  seed: `-- Sample lessons data
INSERT INTO lessons (title, description, level, "order") VALUES
-- A1 Level
('Basic Greetings', 'Learn how to say hello and introduce yourself', 'A1', 1),
('Numbers 1-10', 'Learn basic numbers from one to ten', 'A1', 2),
('Colors and Shapes', 'Learn basic colors and simple shapes', 'A1', 3),
('Family Members', 'Learn words for family relationships', 'A1', 4),
('Days of the Week', 'Learn the seven days of the week', 'A1', 5),

-- A2 Level
('Present Simple Tense', 'Learn how to use present simple tense', 'A2', 1),
('Food and Drinks', 'Learn vocabulary about food and beverages', 'A2', 2),
('Telling Time', 'Learn how to tell time in English', 'A2', 3),
('Weather and Seasons', 'Learn to talk about weather and seasons', 'A2', 4),
('Shopping and Money', 'Learn vocabulary for shopping situations', 'A2', 5),

-- B1 Level
('Past Simple Tense', 'Learn how to talk about past events', 'B1', 1),
('Future Plans', 'Learn to express future intentions', 'B1', 2),
('Travel and Transportation', 'Learn vocabulary for travel situations', 'B1', 3),
('Health and Body', 'Learn vocabulary about health and body parts', 'B1', 4),
('Hobbies and Interests', 'Learn to talk about your hobbies', 'B1', 5);

-- Sample flashcards
INSERT INTO flashcards (word_en, word_ru, level) VALUES
('hello', 'привет', 'A1'),
('goodbye', 'до свидания', 'A1'),
('please', 'пожалуйста', 'A1'),
('thank you', 'спасибо', 'A1'),
('yes', 'да', 'A1'),
('no', 'нет', 'A1'),
('one', 'один', 'A1'),
('two', 'два', 'A1'),
('three', 'три', 'A1'),
('four', 'четыре', 'A1'),
('five', 'пять', 'A1'),
('red', 'красный', 'A1'),
('blue', 'синий', 'A1'),
('green', 'зеленый', 'A1'),
('yellow', 'желтый', 'A1'),
('black', 'черный', 'A1'),
('white', 'белый', 'A1'),
('mother', 'мама', 'A1'),
('father', 'папа', 'A1'),
('brother', 'брат', 'A1'),
('sister', 'сестра', 'A1'),
('eat', 'есть', 'A2'),
('drink', 'пить', 'A2'),
('sleep', 'спать', 'A2'),
('work', 'работать', 'A2'),
('study', 'учиться', 'A2'),
('play', 'играть', 'A2'),
('read', 'читать', 'A2'),
('write', 'писать', 'A2'),
('listen', 'слушать', 'A2'),
('speak', 'говорить', 'A2');`
}

export default function SetupPage() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  const copyToClipboard = async (text: string, scriptName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedScript(scriptName)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Database Setup</h1>
          <p className="text-gray-600">Copy and run these SQL scripts in your Supabase dashboard</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Step 1: Schema */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Step 1: Create Database Schema</h2>
                <p className="text-sm text-gray-600">Run this in Supabase SQL Editor</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                {SQL_SCRIPTS.schema}
              </pre>
              <Button
                onClick={() => copyToClipboard(SQL_SCRIPTS.schema, 'schema')}
                className="absolute top-2 right-2"
                size="sm"
                variant="outline"
              >
                {copiedScript === 'schema' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Step 2: Setup Storage</h2>
                <p className="text-sm text-gray-600">Create storage buckets for media files</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {SQL_SCRIPTS.storage}
              </pre>
              <Button
                onClick={() => copyToClipboard(SQL_SCRIPTS.storage, 'storage')}
                className="absolute top-2 right-2"
                size="sm"
                variant="outline"
              >
                {copiedScript === 'storage' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Seed Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Step 3: Add Sample Data</h2>
                <p className="text-sm text-gray-600">Insert sample lessons and flashcards</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                {SQL_SCRIPTS.seed}
              </pre>
              <Button
                onClick={() => copyToClipboard(SQL_SCRIPTS.seed, 'seed')}
                className="absolute top-2 right-2"
                size="sm"
                variant="outline"
              >
                {copiedScript === 'seed' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
              <li>Open the <strong>SQL Editor</strong></li>
              <li>Create a new query and paste <strong>Step 1</strong> script, then run it</li>
              <li>Create another query and paste <strong>Step 2</strong> script, then run it</li>
              <li>Create another query and paste <strong>Step 3</strong> script, then run it</li>
              <li>Return to your app at <a href="/" className="underline">Home Page</a></li>
            </ol>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
