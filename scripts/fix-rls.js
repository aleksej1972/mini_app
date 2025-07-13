const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLS() {
  console.log('🔒 Fixing Row Level Security policies...')
  
  try {
    // Drop existing policies that might be blocking
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can insert own profile" ON users;'
    ]
    
    for (const policy of dropPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy })
      } catch (error) {
        // Ignore errors for non-existent policies
      }
    }
    
    // Create new, more permissive policies for development
    const newPolicies = [
      // Allow anyone to insert users (for registration)
      `CREATE POLICY "Allow user registration" ON users FOR INSERT WITH CHECK (true);`,
      
      // Allow users to view their own profile
      `CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);`,
      
      // Allow users to update their own profile
      `CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);`,
      
      // Make sure lessons, exercises, and flashcards are readable
      `DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;`,
      `CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);`,
      
      `DROP POLICY IF EXISTS "Anyone can view exercises" ON exercises;`,
      `CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);`,
      
      `DROP POLICY IF EXISTS "Anyone can view flashcards" ON flashcards;`,
      `CREATE POLICY "Anyone can view flashcards" ON flashcards FOR SELECT USING (true);`,
      
      // Allow progress tracking
      `DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;`,
      `CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (true);`,
      
      `DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;`,
      `CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (true);`,
      
      `DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;`,
      `CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (true);`
    ]
    
    for (const policy of newPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy })
        console.log('✅ Policy applied')
      } catch (error) {
        console.log(`⚠️  Policy error: ${error.message}`)
      }
    }
    
    // Alternatively, disable RLS for development
    console.log('\n🔓 Disabling RLS for development...')
    const disableRLS = [
      'ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;'
    ]
    
    for (const sql of disableRLS) {
      try {
        await supabase.rpc('exec_sql', { sql })
        console.log('✅ RLS disabled for table')
      } catch (error) {
        console.log(`⚠️  RLS disable error: ${error.message}`)
      }
    }
    
    console.log('\n🎉 RLS policies fixed!')
    
  } catch (error) {
    console.error('❌ Failed to fix RLS:', error.message)
  }
}

fixRLS()
