const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking database structure...')
  
  try {
    // Check which tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names')
      .catch(async () => {
        // Fallback method - try to query each table
        const tableChecks = [
          { name: 'users', check: () => supabase.from('users').select('count').limit(1) },
          { name: 'lessons', check: () => supabase.from('lessons').select('count').limit(1) },
          { name: 'exercises', check: () => supabase.from('exercises').select('count').limit(1) },
          { name: 'user_progress', check: () => supabase.from('user_progress').select('count').limit(1) },
          { name: 'flashcards', check: () => supabase.from('flashcards').select('count').limit(1) }
        ]
        
        const results = []
        for (const table of tableChecks) {
          try {
            await table.check()
            results.push({ table: table.name, exists: true })
            console.log(`✅ Table '${table.name}' exists`)
          } catch (error) {
            results.push({ table: table.name, exists: false })
            console.log(`❌ Table '${table.name}' missing`)
          }
        }
        return { data: results, error: null }
      })
    
    // Check data in existing tables
    console.log('\n📊 Checking data...')
    
    // Check lessons
    try {
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('count')
      
      if (!lessonsError) {
        const { data: lessonsData } = await supabase.from('lessons').select('*').limit(5)
        console.log(`✅ Lessons table: ${lessonsData?.length || 0} records`)
        if (lessonsData?.length > 0) {
          lessonsData.forEach(lesson => {
            console.log(`   - ${lesson.level}: ${lesson.title}`)
          })
        }
      }
    } catch (error) {
      console.log('❌ Cannot access lessons table')
    }
    
    // Check exercises
    try {
      const { data: exercises } = await supabase.from('exercises').select('*').limit(3)
      console.log(`✅ Exercises table: ${exercises?.length || 0} records`)
      if (exercises?.length > 0) {
        exercises.forEach(exercise => {
          console.log(`   - ${exercise.type}: ${exercise.xp_reward} XP`)
        })
      }
    } catch (error) {
      console.log('❌ Cannot access exercises table')
    }
    
    // Check flashcards
    try {
      const { data: flashcards } = await supabase.from('flashcards').select('*').limit(3)
      console.log(`✅ Flashcards table: ${flashcards?.length || 0} records`)
      if (flashcards?.length > 0) {
        flashcards.forEach(card => {
          console.log(`   - ${card.word_en} = ${card.word_ru}`)
        })
      }
    } catch (error) {
      console.log('❌ Cannot access flashcards table')
    }
    
    // Check storage buckets
    console.log('\n🗄️ Checking storage...')
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (!bucketsError && buckets) {
        console.log(`✅ Storage buckets: ${buckets.length}`)
        buckets.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
        })
      } else {
        console.log('❌ Cannot access storage buckets')
      }
    } catch (error) {
      console.log('❌ Storage not accessible')
    }
    
    console.log('\n🎉 Database check complete!')
    
  } catch (error) {
    console.error('❌ Check failed:', error.message)
  }
}

checkDatabase()
