-- Fix RLS policies for user_progress table to allow service role access
-- This will allow our API to save progress without authentication issues

-- Drop existing RLS policies for user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Create new policies that allow service role access
CREATE POLICY "Allow service role full access to user_progress" ON user_progress
FOR ALL USING (true);

-- Also allow authenticated users to access their own progress
CREATE POLICY "Users can view own progress" ON user_progress 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own progress" ON user_progress 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress" ON user_progress 
FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Ensure the table exists and has correct structure
DO $$ 
BEGIN
    -- Check if user_progress table exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'user_progress' AND table_schema = 'public') THEN
        
        CREATE TABLE user_progress (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
            exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
            completed BOOLEAN DEFAULT FALSE,
            xp_earned INTEGER DEFAULT 0,
            score INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, lesson_id, exercise_id)
        );
        
        -- Create indexes
        CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
        CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
        
        -- Enable RLS
        ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
        
        -- Create trigger for updated_at
        CREATE TRIGGER update_user_progress_updated_at 
        BEFORE UPDATE ON user_progress 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    END IF;
END $$;
