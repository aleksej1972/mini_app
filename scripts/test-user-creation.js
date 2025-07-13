const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testUserCreation() {
  console.log('👤 Testing user creation...')
  
  try {
    const testUser = {
      telegram_id: 123456789,
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      level: 'A1',
      xp: 0
    }
    
    // First, try to delete existing test user
    console.log('🗑️  Cleaning up existing test user...')
    await supabase
      .from('users')
      .delete()
      .eq('telegram_id', testUser.telegram_id)
    
    // Try to create user
    console.log('➕ Creating test user...')
    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating user:', error.message)
      console.log('Error details:', error)
    } else {
      console.log('✅ User created successfully!')
      console.log('User data:', data)
      
      // Test fetching the user
      console.log('\n🔍 Testing user retrieval...')
      const { data: fetchedUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', testUser.telegram_id)
        .single()
      
      if (fetchError) {
        console.error('❌ Error fetching user:', fetchError.message)
      } else {
        console.log('✅ User fetched successfully!')
        console.log('Fetched user:', fetchedUser)
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testUserCreation()
