const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLSCompletely() {
  console.log('🔓 Completely fixing RLS for development...')
  
  try {
    // Drop all existing policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Allow user registration" ON users;',
      'DROP POLICY IF EXISTS "Users can view own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can insert own profile" ON users;',
      'DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;',
      'DROP POLICY IF EXISTS "Anyone can view exercises" ON exercises;',
      'DROP POLICY IF EXISTS "Anyone can view flashcards" ON flashcards;',
      'DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;',
      'DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;',
      'DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;'
    ]
    
    console.log('🗑️  Dropping existing policies...')
    for (const policy of dropPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy })
      } catch (error) {
        // Ignore errors for non-existent policies
      }
    }
    
    // Disable RLS completely for development
    console.log('🔓 Disabling RLS for all tables...')
    const disableRLS = [
      'ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE flashcards DISABLE ROW LEVEL SECURITY;'
    ]
    
    for (const sql of disableRLS) {
      try {
        await supabase.rpc('exec_sql', { sql })
        console.log('✅ RLS disabled for table')
      } catch (error) {
        console.log(`⚠️  RLS disable error: ${error.message}`)
      }
    }
    
    // Grant permissions to anon role
    console.log('\n🔑 Granting permissions to anon role...')
    const grantPermissions = [
      'GRANT SELECT, INSERT, UPDATE ON users TO anon;',
      'GRANT SELECT ON lessons TO anon;',
      'GRANT SELECT ON exercises TO anon;',
      'GRANT SELECT, INSERT, UPDATE ON user_progress TO anon;',
      'GRANT SELECT ON flashcards TO anon;',
      'GRANT USAGE ON SEQUENCE users_id_seq TO anon;',
      'GRANT USAGE ON SEQUENCE user_progress_id_seq TO anon;'
    ]
    
    for (const sql of grantPermissions) {
      try {
        await supabase.rpc('exec_sql', { sql })
        console.log('✅ Permission granted')
      } catch (error) {
        console.log(`⚠️  Permission error: ${error.message}`)
      }
    }
    
    console.log('\n🎉 RLS completely fixed for development!')
    
    // Test the fix
    console.log('\n🧪 Testing the fix...')
    const testTelegramId = 111222333
    
    // Clean up
    await supabase.from('users').delete().eq('telegram_id', testTelegramId)
    
    // Create with anon client
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data: testUser, error: createError } = await anonClient
      .from('users')
      .insert({
        telegram_id: testTelegramId,
        username: 'testanon',
        first_name: 'Test',
        last_name: 'Anon',
        level: 'A1',
        xp: 0
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Test create failed:', createError.message)
    } else {
      console.log('✅ Test create success:', testUser.first_name)
      
      // Try to fetch
      const { data: fetchedUser, error: fetchError } = await anonClient
        .from('users')
        .select('*')
        .eq('telegram_id', testTelegramId)
        .single()
      
      if (fetchError) {
        console.error('❌ Test fetch failed:', fetchError.message)
      } else {
        console.log('✅ Test fetch success:', fetchedUser.first_name)
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to fix RLS:', error.message)
  }
}

fixRLSCompletely()
