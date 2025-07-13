-- Add memory-match exercise type to the existing CHECK constraint
ALTER TABLE exercises 
DROP CONSTRAINT IF EXISTS exercises_type_check;

ALTER TABLE exercises 
ADD CONSTRAINT exercises_type_check 
CHECK (type IN ('quiz', 'fill-in-the-blank', 'word-puzzle', 'audio-quiz', 'sentence-builder', 'reading', 'dialog', 'speech-practice', 'memory-match'));
