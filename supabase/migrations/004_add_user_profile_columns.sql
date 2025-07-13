-- Add missing columns to users table for the new user system
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(100),
ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'light',
ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create index for nickname lookups
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Add constraint for theme values
ALTER TABLE users 
ADD CONSTRAINT users_theme_check 
CHECK (theme IN ('light', 'dark'));

-- Update existing users to have default values
UPDATE users 
SET 
    total_xp = COALESCE(xp, 0),
    theme = 'light',
    is_onboarded = false,
    current_streak = 0,
    last_activity_date = CURRENT_DATE
WHERE nickname IS NULL;

-- Migrate existing data: create nicknames from usernames or telegram_id
UPDATE users 
SET nickname = COALESCE(username, 'user_' || telegram_id::text)
WHERE nickname IS NULL;
