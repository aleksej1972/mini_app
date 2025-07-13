import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - получить пользователя по telegram_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramId = searchParams.get('telegram_id')

    if (!telegramId) {
      return NextResponse.json({ error: 'telegram_id is required' }, { status: 400 })
    }

    // Преобразуем telegram_id в число, если это возможно
    const telegramIdNum = parseInt(telegramId)
    if (isNaN(telegramIdNum)) {
      return NextResponse.json({ error: 'Invalid telegram_id format' }, { status: 400 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramIdNum)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Если пользователь найден, форматируем его данные
    if (user) {
      const formattedUser = {
        id: user.id,
        telegram_id: user.telegram_id,
        // Используем новые колонки, если есть, иначе старые
        nickname: user.nickname || user.username || user.first_name || 'User',
        avatar: user.avatar || user.first_name || '👤',
        level: user.level || 'A1',
        theme: user.theme || 'light',
        is_onboarded: user.is_onboarded !== undefined ? user.is_onboarded : true,
        total_xp: user.total_xp !== undefined ? user.total_xp : (user.xp || 0),
        current_streak: user.current_streak || 0,
        last_activity_date: user.last_activity_date || new Date().toISOString().split('T')[0],
        created_at: user.created_at,
        updated_at: user.updated_at
      }
      return NextResponse.json({ user: formattedUser })
    }

    return NextResponse.json({ user: null })
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - создать нового пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramId, nickname, avatar, level, theme = 'light' } = body

    // Валидация
    if (!telegramId || !nickname || !avatar || !level) {
      return NextResponse.json(
        { error: 'All fields are required: telegramId, nickname, avatar, level' },
        { status: 400 }
      )
    }

    // Преобразуем telegram_id в число
    const telegramIdNum = parseInt(telegramId)
    if (isNaN(telegramIdNum)) {
      return NextResponse.json({ error: 'Invalid telegram_id format' }, { status: 400 })
    }

    // Проверяем, не существует ли уже пользователь с таким telegram_id
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramIdNum)
      .single()

    if (existingUser) {
      // Если пользователь существует, обновляем его данные вместо создания нового
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          username: nickname,
          first_name: avatar,
          level,
          xp: existingUser.xp || 0,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', telegramIdNum)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      // Возвращаем обновленного пользователя в ожидаемом формате
      const formattedUser = {
        id: updatedUser.id,
        telegram_id: updatedUser.telegram_id,
        nickname: updatedUser.username,
        avatar: updatedUser.first_name,
        level: updatedUser.level,
        theme: 'light',
        is_onboarded: true,
        total_xp: updatedUser.xp,
        current_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }

      return NextResponse.json({ user: formattedUser }, { status: 200 })
    }

    // Создаем пользователя с существующими колонками
    // Пробуем создать пользователя с новыми колонками, если не получается - со старыми
    let insertData: any = {
      telegram_id: telegramIdNum,
      level,
    }

    // Пробуем добавить новые колонки
    try {
      insertData = {
        ...insertData,
        nickname: nickname,
        avatar: avatar,
        theme: theme || 'light',
        is_onboarded: true,
        total_xp: 0,
        current_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0]
      }
    } catch (e) {
      // Если новые колонки не работают, используем старые
      insertData = {
        ...insertData,
        username: nickname,
        first_name: avatar,
        xp: 0
      }
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Возвращаем пользователя в ожидаемом формате
    const formattedUser = {
      id: user.id,
      telegram_id: user.telegram_id,
      nickname: user.nickname || user.username || 'User',
      avatar: user.avatar || user.first_name || '👤',
      level: user.level,
      theme: user.theme || 'light',
      is_onboarded: user.is_onboarded !== undefined ? user.is_onboarded : true,
      total_xp: user.total_xp !== undefined ? user.total_xp : (user.xp || 0),
      current_streak: user.current_streak || 0,
      last_activity_date: user.last_activity_date || new Date().toISOString().split('T')[0],
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return NextResponse.json({ user: formattedUser }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - обновить пользователя
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramId, nickname, avatar, level, theme, total_xp, ...otherData } = body

    if (!telegramId) {
      return NextResponse.json({ error: 'telegram_id is required' }, { status: 400 })
    }

    // Преобразуем telegram_id в число
    const telegramIdNum = parseInt(telegramId)
    if (isNaN(telegramIdNum)) {
      return NextResponse.json({ error: 'Invalid telegram_id format' }, { status: 400 })
    }

    // Маппим новые поля на существующие колонки
    const updateFields: any = {
      updated_at: new Date().toISOString()
    }

    if (nickname) updateFields.username = nickname
    if (avatar) updateFields.first_name = avatar
    if (level) updateFields.level = level
    if (total_xp !== undefined) updateFields.xp = total_xp

    const { data: user, error } = await supabase
      .from('users')
      .update(updateFields)
      .eq('telegram_id', telegramIdNum)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Форматируем ответ
    const formattedUser = {
      id: user.id,
      telegram_id: user.telegram_id,
      nickname: user.username,
      avatar: user.first_name,
      level: user.level,
      theme: 'light',
      is_onboarded: true,
      total_xp: user.xp,
      current_streak: 0,
      last_activity_date: new Date().toISOString().split('T')[0],
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return NextResponse.json({ user: formattedUser })
  } catch (error) {
    console.error('Error in PUT /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
