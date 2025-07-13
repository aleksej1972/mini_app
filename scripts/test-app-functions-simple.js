const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Replicate the app functions
async function createUser(userData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      // Return a mock user if creation fails
      return {
        id: `user-${userData.telegram_id}`,
        telegram_id: userData.telegram_id,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        level: userData.level || 'A1',
        xp: userData.xp || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return data
  } catch (error) {
    console.error('Error in createUser:', error)
    // Return a mock user as fallback
    return {
      id: `user-${userData.telegram_id}`,
      telegram_id: userData.telegram_id,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      level: userData.level || 'A1',
      xp: userData.xp || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

async function getUserByTelegramId(telegramId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserByTelegramId:', error)
    return null
  }
}

async function getAllLessons() {
  try {
    const { data, error } = await supabaseAdmin
      .from('lessons')
      .select('*')
      .order('level, order')

    if (error) {
      console.error('Error fetching all lessons:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllLessons:', error)
    return []
  }
}

async function getExercisesByLessonId(lessonId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order')

    if (error) {
      console.error('Error fetching exercises:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getExercisesByLessonId:', error)
    return []
  }
}

async function testAppFunctions() {
  console.log('🧪 Testing app functions...')
  
  try {
    const testTelegramId = 555666777
    
    // Clean up first
    await supabaseAdmin.from('users').delete().eq('telegram_id', testTelegramId)
    
    // Test 1: Create user
    console.log('\n1️⃣ Testing user creation...')
    const userData = {
      telegram_id: testTelegramId,
      username: 'apptest',
      first_name: 'App',
      last_name: 'Test',
      level: 'A1',
      xp: 0
    }
    
    const createdUser = await createUser(userData)
    if (!createdUser) {
      throw new Error('Failed to create user')
    }
    console.log('✅ User created:', createdUser.first_name)
    
    // Test 2: Fetch user
    console.log('\n2️⃣ Testing user retrieval...')
    const fetchedUser = await getUserByTelegramId(testTelegramId)
    if (!fetchedUser) {
      throw new Error('Failed to fetch user')
    }
    console.log('✅ User fetched:', fetchedUser.first_name)
    
    // Test 3: Get lessons
    console.log('\n3️⃣ Testing lessons loading...')
    const lessons = await getAllLessons()
    if (lessons.length === 0) {
      throw new Error('No lessons found')
    }
    console.log(`✅ Found ${lessons.length} lessons`)
    
    // Test 4: Get exercises
    console.log('\n4️⃣ Testing exercises loading...')
    const exercises = await getExercisesByLessonId(lessons[0].id)
    if (exercises.length === 0) {
      throw new Error('No exercises found')
    }
    console.log(`✅ Found ${exercises.length} exercises for lesson: ${lessons[0].title}`)
    
    console.log('\n🎉 All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAppFunctions()
