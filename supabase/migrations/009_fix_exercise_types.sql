-- Fix exercise types constraint to include memory-match
-- Drop the old constraint and create a new one

-- Drop existing constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_type_check;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint exercises_type_check does not exist or could not be dropped';
END $$;

-- Create new constraint with all exercise types including memory-match
ALTER TABLE exercises 
ADD CONSTRAINT exercises_type_check 
CHECK (type IN (
    'quiz', 
    'fill-in-the-blank', 
    'word-puzzle', 
    'audio-quiz', 
    'sentence-builder', 
    'reading', 
    'dialog', 
    'speech-practice', 
    'memory-match'
));
