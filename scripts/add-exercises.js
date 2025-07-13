const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addExercises() {
  console.log('🎮 Adding exercises to lessons...')
  
  try {
    // Get all lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('level, order')
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError.message)
      return
    }
    
    console.log(`📚 Found ${lessons.length} lessons`)
    
    // Add exercises for each lesson
    for (const lesson of lessons) {
      console.log(`\n📝 Adding exercises for: ${lesson.title}`)
      
      // Check if exercises already exist
      const { data: existingExercises } = await supabase
        .from('exercises')
        .select('id')
        .eq('lesson_id', lesson.id)
      
      if (existingExercises && existingExercises.length > 0) {
        console.log(`   ✅ Already has ${existingExercises.length} exercises`)
        continue
      }
      
      // Create exercises based on lesson level and topic
      const exercises = createExercisesForLesson(lesson)
      
      const { error: insertError } = await supabase
        .from('exercises')
        .insert(exercises)
      
      if (insertError) {
        console.log(`   ❌ Error: ${insertError.message}`)
      } else {
        console.log(`   ✅ Added ${exercises.length} exercises`)
      }
    }
    
    console.log('\n🎉 Exercises added successfully!')
    
  } catch (error) {
    console.error('❌ Failed to add exercises:', error.message)
  }
}

function createExercisesForLesson(lesson) {
  const exercises = []
  
  // Basic exercises for all lessons
  exercises.push({
    lesson_id: lesson.id,
    type: 'quiz',
    content_json: getQuizContent(lesson),
    xp_reward: 10,
    order: 1
  })
  
  exercises.push({
    lesson_id: lesson.id,
    type: 'fill-in-the-blank',
    content_json: getFillInBlankContent(lesson),
    xp_reward: 10,
    order: 2
  })
  
  exercises.push({
    lesson_id: lesson.id,
    type: 'sentence-builder',
    content_json: getSentenceBuilderContent(lesson),
    xp_reward: 15,
    order: 3
  })
  
  return exercises
}

function getQuizContent(lesson) {
  const quizzes = {
    'Basic Greetings': {
      question: "How do you greet someone in the morning?",
      options: ["Good morning", "Good night", "Good afternoon", "Good evening"],
      correct: "Good morning"
    },
    'Numbers 1-10': {
      question: "What number comes after seven?",
      options: ["six", "eight", "nine", "ten"],
      correct: "eight"
    },
    'Colors and Shapes': {
      question: "What color do you get when you mix red and yellow?",
      options: ["green", "orange", "purple", "blue"],
      correct: "orange"
    },
    'Present Simple Tense': {
      question: "Which sentence is correct?",
      options: ["She go to school", "She goes to school", "She going to school", "She is go to school"],
      correct: "She goes to school"
    },
    'Food and Drinks': {
      question: "What do you drink in the morning?",
      options: ["coffee", "dinner", "lunch", "breakfast"],
      correct: "coffee"
    },
    'Past Simple Tense': {
      question: "What is the past tense of 'go'?",
      options: ["goed", "went", "going", "goes"],
      correct: "went"
    }
  }
  
  return quizzes[lesson.title] || {
    question: `What is this lesson about?`,
    options: [lesson.title, "Something else", "I don't know", "Other topic"],
    correct: lesson.title
  }
}

function getFillInBlankContent(lesson) {
  const fillInBlanks = {
    'Basic Greetings': {
      sentence: "Hello, my name ___ John.",
      options: ["is", "are", "am", "be"],
      correct: "is"
    },
    'Numbers 1-10': {
      sentence: "I have ___ apples.",
      options: ["five", "fives", "fifth", "fiveth"],
      correct: "five"
    },
    'Colors and Shapes': {
      sentence: "The sky is ___.",
      options: ["blue", "red", "green", "yellow"],
      correct: "blue"
    },
    'Present Simple Tense': {
      sentence: "I ___ coffee every morning.",
      options: ["drink", "drinks", "drinking", "drank"],
      correct: "drink"
    },
    'Food and Drinks': {
      sentence: "I am ___ because I didn't eat.",
      options: ["hungry", "thirsty", "tired", "happy"],
      correct: "hungry"
    },
    'Past Simple Tense': {
      sentence: "Yesterday I ___ to the store.",
      options: ["go", "went", "going", "goes"],
      correct: "went"
    }
  }
  
  return fillInBlanks[lesson.title] || {
    sentence: "This lesson is about ___.",
    options: ["learning", "playing", "sleeping", "eating"],
    correct: "learning"
  }
}

function getSentenceBuilderContent(lesson) {
  const sentenceBuilders = {
    'Basic Greetings': {
      translation: "Меня зовут Анна.",
      correct_order: ["My", "name", "is", "Anna"],
      extra_words: ["am", "called", "the"]
    },
    'Numbers 1-10': {
      translation: "У меня пять яблок.",
      correct_order: ["I", "have", "five", "apples"],
      extra_words: ["six", "many", "some"]
    },
    'Colors and Shapes': {
      translation: "Красная машина быстрая.",
      correct_order: ["The", "red", "car", "is", "fast"],
      extra_words: ["blue", "slow", "big"]
    },
    'Present Simple Tense': {
      translation: "Она работает каждый день.",
      correct_order: ["She", "works", "every", "day"],
      extra_words: ["worked", "working", "night"]
    },
    'Food and Drinks': {
      translation: "Я люблю пить чай.",
      correct_order: ["I", "like", "to", "drink", "tea"],
      extra_words: ["coffee", "eating", "food"]
    },
    'Past Simple Tense': {
      translation: "Вчера я играл в футбол.",
      correct_order: ["Yesterday", "I", "played", "football"],
      extra_words: ["today", "play", "basketball"]
    }
  }
  
  return sentenceBuilders[lesson.title] || {
    translation: "Это урок английского языка.",
    correct_order: ["This", "is", "an", "English", "lesson"],
    extra_words: ["Russian", "difficult", "easy"]
  }
}

addExercises()
