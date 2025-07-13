-- Direct ALTER TABLE commands to add missing columns
-- This will fail silently if columns already exist

-- Add nickname column
ALTER TABLE users ADD COLUMN nickname VARCHAR(50);

-- Add avatar column  
ALTER TABLE users ADD COLUMN avatar VARCHAR(100);

-- Add theme column
ALTER TABLE users ADD COLUMN theme VARCHAR(10) DEFAULT 'light';

-- Add is_onboarded column
ALTER TABLE users ADD COLUMN is_onboarded BOOLEAN DEFAULT false;

-- Add total_xp column
ALTER TABLE users ADD COLUMN total_xp INTEGER DEFAULT 0;

-- Add current_streak column
ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;

-- Add last_activity_date column
ALTER TABLE users ADD COLUMN last_activity_date DATE;

-- Create indexes
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

-- Add constraints
ALTER TABLE users ADD CONSTRAINT users_theme_check CHECK (theme IN ('light', 'dark'));
ALTER TABLE users ADD CONSTRAINT users_nickname_unique UNIQUE (nickname);

-- Update existing users with default values
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
