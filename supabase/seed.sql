-- Sample lessons data
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

-- Sample exercises for A1 Level - Basic Greetings lesson
INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'quiz',
    '{"question": "How do you greet someone in the morning?", "options": ["Good morning", "Good night", "Good afternoon", "Good evening"], "correct": "Good morning"}',
    10,
    1
FROM lessons l WHERE l.title = 'Basic Greetings' AND l.level = 'A1';

INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'fill-in-the-blank',
    '{"sentence": "Hello, my name ___ John.", "options": ["is", "are", "am", "be"], "correct": "is"}',
    10,
    2
FROM lessons l WHERE l.title = 'Basic Greetings' AND l.level = 'A1';

INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'sentence-builder',
    '{"translation": "Меня зовут Анна.", "correct_order": ["My", "name", "is", "Anna"], "extra_words": ["am", "called", "the"]}',
    15,
    3
FROM lessons l WHERE l.title = 'Basic Greetings' AND l.level = 'A1';

-- Sample exercises for A1 Level - Numbers 1-10 lesson
INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'quiz',
    '{"question": "What number comes after seven?", "options": ["six", "eight", "nine", "ten"], "correct": "eight"}',
    10,
    1
FROM lessons l WHERE l.title = 'Numbers 1-10' AND l.level = 'A1';

INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'word-puzzle',
    '{"target": "five", "words": ["five", "four", "six", "seven", "three", "nine"]}',
    10,
    2
FROM lessons l WHERE l.title = 'Numbers 1-10' AND l.level = 'A1';

-- Sample exercises for A2 Level - Present Simple lesson
INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'quiz',
    '{"question": "Which sentence is correct?", "options": ["She go to school", "She goes to school", "She going to school", "She is go to school"], "correct": "She goes to school"}',
    15,
    1
FROM lessons l WHERE l.title = 'Present Simple Tense' AND l.level = 'A2';

INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'fill-in-the-blank',
    '{"sentence": "I ___ coffee every morning.", "options": ["drink", "drinks", "drinking", "drank"], "correct": "drink"}',
    15,
    2
FROM lessons l WHERE l.title = 'Present Simple Tense' AND l.level = 'A2';

INSERT INTO exercises (lesson_id, type, content_json, xp_reward, "order") 
SELECT 
    l.id,
    'reading',
    '{"text": "Tom is a student. He studies English every day. He likes reading books and watching movies. Tom goes to school by bus.", "questions": [{"question": "How does Tom go to school?", "options": ["By car", "By bus", "By bike", "On foot"], "correct": "By bus"}]}',
    20,
    3
FROM lessons l WHERE l.title = 'Present Simple Tense' AND l.level = 'A2';

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
('speak', 'говорить', 'A2');
