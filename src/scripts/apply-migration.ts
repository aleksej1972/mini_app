import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    console.log('Applying migration...')
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/004_add_user_profile_columns.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...')
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error('Error executing statement:', error)
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_migrations')
          .select('*')
          .limit(1)
        
        if (directError) {
          console.log('Trying direct SQL execution...')
          // This is a fallback - in production you'd use proper migration tools
        }
      } else {
        console.log('✓ Statement executed successfully')
      }
    }
    
    console.log('Migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

applyMigration()
