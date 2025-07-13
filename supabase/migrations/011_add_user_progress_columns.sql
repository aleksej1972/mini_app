-- Add missing columns to user_progress table

-- Add xp_earned column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' 
                   AND column_name = 'xp_earned' 
                   AND table_schema = 'public') THEN
        ALTER TABLE user_progress ADD COLUMN xp_earned INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add score column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' 
                   AND column_name = 'score' 
                   AND table_schema = 'public') THEN
        ALTER TABLE user_progress ADD COLUMN score INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update the unique constraint to allow multiple exercises per lesson
DO $$ 
BEGIN
    -- Drop old constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'user_progress_user_id_lesson_id_exercise_id_key' 
               AND table_name = 'user_progress') THEN
        ALTER TABLE user_progress DROP CONSTRAINT user_progress_user_id_lesson_id_exercise_id_key;
    END IF;
    
    -- Add new constraint that allows multiple exercises per lesson but unique exercise completions
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'user_progress_unique_exercise' 
                   AND table_name = 'user_progress') THEN
        ALTER TABLE user_progress ADD CONSTRAINT user_progress_unique_exercise 
        UNIQUE(user_id, lesson_id, exercise_id);
    END IF;
END $$;
