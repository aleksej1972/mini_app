import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - проверить доступность никнейма
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nickname = searchParams.get('nickname')
    const telegramId = searchParams.get('telegram_id') // Добавляем возможность исключить текущего пользователя

    if (!nickname) {
      return NextResponse.json({ error: 'nickname is required' }, { status: 400 })
    }

    // Проверяем длину никнейма
    if (nickname.length < 3 || nickname.length > 20) {
      return NextResponse.json({ 
        available: false, 
        error: 'Nickname must be between 3 and 20 characters' 
      })
    }

    // Проверяем на недопустимые символы
    const validNickname = /^[a-zA-Z0-9_-]+$/.test(nickname)
    if (!validNickname) {
      return NextResponse.json({ 
        available: false, 
        error: 'Nickname can only contain letters, numbers, underscore and dash' 
      })
    }

    // Проверяем доступность в базе данных (пробуем nickname, потом username)
    const { data: existingUsers, error } = await supabase
      .from('users')
      .select('id, telegram_id, nickname, username')
      .or(`nickname.eq.${nickname},username.eq.${nickname}`)

    if (error) {
      console.error('Error checking nickname:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Проверяем, есть ли пользователь с таким никнеймом, исключая текущего пользователя
    const conflictingUser = existingUsers?.find(user =>
      telegramId ? user.telegram_id.toString() !== telegramId : true
    )

    const available = !conflictingUser
    
    return NextResponse.json({ 
      available,
      nickname,
      error: available ? null : 'Nickname is already taken'
    })
  } catch (error) {
    console.error('Error in GET /api/users/check-nickname:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
