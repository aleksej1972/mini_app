const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up database...')
  
  try {
    // Test connection
    console.log('📡 Testing connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error && error.code === '42P01') {
      console.log('📋 Tables not found, creating schema...')
      await createTables()
    } else if (error) {
      console.error('❌ Database connection error:', error.message)
      return
    } else {
      console.log('✅ Database connection successful')
      console.log('📊 Tables already exist')
    }
    
    // Check if we have sample data
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('count')
      .limit(1)
    
    if (!lessonsError && lessons && lessons.length === 0) {
      console.log('📝 Adding sample data...')
      await addSampleData()
    } else {
      console.log('✅ Sample data already exists')
    }
    
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

async function createTables() {
  // Note: In a real setup, you would run the SQL migration file
  // For now, we'll just check if tables exist
  console.log('⚠️  Please run the SQL migration manually in Supabase dashboard:')
  console.log('   1. Go to your Supabase project dashboard')
  console.log('   2. Navigate to SQL Editor')
  console.log('   3. Run the contents of: supabase/migrations/001_initial_schema.sql')
  console.log('   4. Run the contents of: supabase/storage/setup.sql')
  console.log('   5. Run the contents of: supabase/seed.sql')
}

async function addSampleData() {
  // Add sample lessons
  const { error: lessonsError } = await supabase
    .from('lessons')
    .insert([
      {
        title: 'Basic Greetings',
        description: 'Learn how to say hello and introduce yourself',
        level: 'A1',
        order: 1
      },
      {
        title: 'Numbers 1-10',
        description: 'Learn basic numbers from one to ten',
        level: 'A1',
        order: 2
      },
      {
        title: 'Present Simple Tense',
        description: 'Learn how to use present simple tense',
        level: 'A2',
        order: 1
      }
    ])
  
  if (lessonsError) {
    console.error('❌ Error adding lessons:', lessonsError.message)
    return
  }
  
  console.log('✅ Sample lessons added')
}

// Run setup
setupDatabase()
