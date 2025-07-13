const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

async function debugUserIssue() {
  console.log('🔍 Debugging user creation and retrieval...')
  
  const testTelegramId = 999888777
  
  try {
    // Clean up first
    console.log('🗑️  Cleaning up existing test user...')
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('telegram_id', testTelegramId)
    
    // Create user with admin client
    console.log('➕ Creating user with admin client...')
    const { data: createdUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        telegram_id: testTelegramId,
        username: 'debuguser',
        first_name: 'Debug',
        last_name: 'User',
        level: 'A1',
        xp: 0
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Create error:', createError)
      return
    }
    
    console.log('✅ User created:', createdUser)
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Try to fetch with admin client
    console.log('\n🔍 Fetching with admin client...')
    const { data: adminFetch, error: adminError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('telegram_id', testTelegramId)
      .single()
    
    if (adminError) {
      console.error('❌ Admin fetch error:', adminError)
    } else {
      console.log('✅ Admin fetch success:', adminFetch)
    }
    
    // Try to fetch with anon client
    console.log('\n🔍 Fetching with anon client...')
    const { data: anonFetch, error: anonError } = await supabaseAnon
      .from('users')
      .select('*')
      .eq('telegram_id', testTelegramId)
      .single()
    
    if (anonError) {
      console.error('❌ Anon fetch error:', anonError)
      console.log('Error details:', anonError)
    } else {
      console.log('✅ Anon fetch success:', anonFetch)
    }
    
    // Check all users
    console.log('\n📊 Checking all users...')
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from('users')
      .select('telegram_id, first_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (allError) {
      console.error('❌ All users error:', allError)
    } else {
      console.log('✅ Recent users:')
      allUsers.forEach(user => {
        console.log(`   - ${user.telegram_id}: ${user.first_name} (${user.created_at})`)
      })
    }
    
    // Check RLS status
    console.log('\n🔒 Checking RLS status...')
    const { data: rlsStatus, error: rlsError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';" 
      })
    
    if (!rlsError && rlsStatus) {
      console.log('RLS status:', rlsStatus)
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

debugUserIssue()
