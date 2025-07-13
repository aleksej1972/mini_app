const { createUser, getUserByTelegramId, getAllLessons, getExercisesByLessonId } = require('../src/lib/database.ts')
require('dotenv').config({ path: '.env.local' })

async function testAppFunctions() {
  console.log('🧪 Testing app functions...')
  
  try {
    const testTelegramId = 555666777
    
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
