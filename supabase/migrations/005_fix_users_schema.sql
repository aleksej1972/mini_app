-- Fix users table schema - ensure all required columns exist
-- This migration is idempotent and safe to run multiple times

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add nickname column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'nickname') THEN
        ALTER TABLE users ADD COLUMN nickname VARCHAR(50) UNIQUE;
    END IF;
    
    -- Add avatar column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'avatar') THEN
        ALTER TABLE users ADD COLUMN avatar VARCHAR(100);
    END IF;
    
    -- Add theme column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'theme') THEN
        ALTER TABLE users ADD COLUMN theme VARCHAR(10) DEFAULT 'light';
    END IF;
    
    -- Add is_onboarded column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_onboarded') THEN
        ALTER TABLE users ADD COLUMN is_onboarded BOOLEAN DEFAULT false;
    END IF;
    
    -- Add total_xp column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'total_xp') THEN
        ALTER TABLE users ADD COLUMN total_xp INTEGER DEFAULT 0;
    END IF;
    
    -- Add current_streak column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'current_streak') THEN
        ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;
    END IF;
    
    -- Add last_activity_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'last_activity_date') THEN
        ALTER TABLE users ADD COLUMN last_activity_date DATE;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Add constraints if they don't exist
DO $$
BEGIN
    -- Add theme constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                   WHERE constraint_name = 'users_theme_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_theme_check 
        CHECK (theme IN ('light', 'dark'));
    END IF;
END $$;

-- Migrate existing data safely
UPDATE users 
SET 
    total_xp = COALESCE(total_xp, xp, 0),
    theme = COALESCE(theme, 'light'),
    is_onboarded = COALESCE(is_onboarded, false),
    current_streak = COALESCE(current_streak, 0),
    last_activity_date = COALESCE(last_activity_date, CURRENT_DATE)
WHERE total_xp IS NULL OR theme IS NULL OR is_onboarded IS NULL 
   OR current_streak IS NULL OR last_activity_date IS NULL;

-- Create nicknames for users who don't have them
UPDATE users 
SET nickname = COALESCE(nickname, username, 'user_' || telegram_id::text)
WHERE nickname IS NULL;
