-- Force add missing columns to users table
-- This migration will add columns that don't exist and ignore errors for existing ones

-- Add nickname column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN nickname VARCHAR(50);
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column nickname already exists';
END $$;

-- Add avatar column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN avatar VARCHAR(100);
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column avatar already exists';
END $$;

-- Add theme column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN theme VARCHAR(10) DEFAULT 'light';
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column theme already exists';
END $$;

-- Add is_onboarded column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN is_onboarded BOOLEAN DEFAULT false;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column is_onboarded already exists';
END $$;

-- Add total_xp column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN total_xp INTEGER DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column total_xp already exists';
END $$;

-- Add current_streak column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column current_streak already exists';
END $$;

-- Add last_activity_date column (ignore error if exists)
DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN last_activity_date DATE DEFAULT CURRENT_DATE;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column last_activity_date already exists';
END $$;

-- Create indexes (ignore errors if exist)
DO $$ 
BEGIN
    CREATE INDEX idx_users_nickname ON users(nickname);
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index idx_users_nickname already exists';
END $$;

DO $$ 
BEGIN
    CREATE INDEX idx_users_telegram_id ON users(telegram_id);
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index idx_users_telegram_id already exists';
END $$;

-- Add constraints (ignore errors if exist)
DO $$ 
BEGIN
    ALTER TABLE users ADD CONSTRAINT users_theme_check CHECK (theme IN ('light', 'dark'));
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint users_theme_check already exists';
END $$;

DO $$ 
BEGIN
    ALTER TABLE users ADD CONSTRAINT users_nickname_unique UNIQUE (nickname);
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Constraint users_nickname_unique already exists';
END $$;

-- Migrate data from old columns to new ones
UPDATE users 
SET 
    nickname = COALESCE(nickname, username, 'user_' || telegram_id::text),
    avatar = COALESCE(avatar, first_name, '👤'),
    theme = COALESCE(theme, 'light'),
    is_onboarded = COALESCE(is_onboarded, true),
    total_xp = COALESCE(total_xp, xp, 0),
    current_streak = COALESCE(current_streak, 0),
    last_activity_date = COALESCE(last_activity_date, CURRENT_DATE)
WHERE nickname IS NULL OR avatar IS NULL OR total_xp IS NULL;
