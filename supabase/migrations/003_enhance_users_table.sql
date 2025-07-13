-- Enhance users table with additional fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(100),
ADD COLUMN IF NOT EXISTS level VARCHAR(10) DEFAULT 'A1',
ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'light',
ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create index for nickname lookups
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Create index for telegram_id lookups
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Add constraint for level values
ALTER TABLE users 
ADD CONSTRAINT users_level_check 
CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));

-- Add constraint for theme values
ALTER TABLE users 
ADD CONSTRAINT users_theme_check 
CHECK (theme IN ('light', 'dark'));

-- Create user_achievements table for tracking achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_data JSONB,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

-- Create user_settings table for additional user preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    daily_goal_minutes INTEGER DEFAULT 15,
    preferred_study_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
