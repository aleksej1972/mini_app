import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - получить прогресс пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramId = searchParams.get('telegram_id')

    if (!telegramId) {
      return NextResponse.json({ error: 'telegram_id is required' }, { status: 400 })
    }

    // Получаем пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', parseInt(telegramId) || telegramId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Получаем все уроки для уровня пользователя
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('level', user.level)
      .order('order')

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      return NextResponse.json({ error: lessonsError.message }, { status: 500 })
    }

    // Получаем прогресс пользователя
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    if (progressError) {
      console.error('Error fetching progress:', progressError)
      // Если таблица прогресса не существует, возвращаем пустой прогресс
      const progressData = {
        user: {
          id: user.id,
          telegram_id: user.telegram_id,
          nickname: user.username || 'User',
          avatar: user.first_name || '👤',
          level: user.level,
          theme: 'light',
          is_onboarded: true,
          total_xp: user.xp || 0,
          current_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        lessons: lessons || [],
        progress: [],
        stats: {
          totalLessons: lessons?.length || 0,
          completedLessons: 0,
          totalXP: user.xp || 0,
          currentStreak: 0,
          nextLesson: lessons?.[0] || null
        }
      }
      return NextResponse.json(progressData)
    }

    // Подсчитываем статистику
    const completedLessons = progress?.filter(p => p.completed).length || 0
    const nextLesson = lessons?.find(lesson => 
      !progress?.some(p => p.lesson_id === lesson.id && p.completed)
    ) || null

    const progressData = {
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        nickname: user.username || 'User',
        avatar: user.first_name || '👤',
        level: user.level,
        theme: 'light',
        is_onboarded: true,
        total_xp: user.xp || 0,
        current_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      lessons: lessons || [],
      progress: progress || [],
      stats: {
        totalLessons: lessons?.length || 0,
        completedLessons,
        totalXP: user.xp || 0,
        currentStreak: 0,
        nextLesson
      }
    }

    return NextResponse.json(progressData)
  } catch (error) {
    console.error('Error in GET /api/users/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - сохранить прогресс урока
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegramId, lessonId, exerciseId, completed = false, xpEarned = 0, score } = body

    if (!telegramId || !lessonId) {
      return NextResponse.json({
        error: 'telegram_id and lesson_id are required'
      }, { status: 400 })
    }

    // Получаем пользователя
    const telegramIdNum = parseInt(telegramId)
    if (isNaN(telegramIdNum)) {
      return NextResponse.json({ error: 'Invalid telegram_id format' }, { status: 400 })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramIdNum)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем, есть ли уже запись прогресса для этого урока
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    let progressData
    if (existingProgress) {
      // Обновляем существующий прогресс - используем только базовые колонки
      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .update({
          completed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating progress:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
      progressData = updatedProgress
    } else {
      // Создаем новую запись прогресса - используем только базовые колонки
      const insertData: any = {
        user_id: user.id,
        lesson_id: lessonId,
        completed
      }

      // Добавляем exercise_id только если он предоставлен
      if (exerciseId) {
        insertData.exercise_id = exerciseId
      }

      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert([insertData])
        .select()
        .single()

      if (createError) {
        console.error('Error creating progress:', createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }
      progressData = newProgress
    }

    // Обновляем общий XP пользователя
    if (xpEarned > 0) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          xp: (user.xp || 0) + xpEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (userUpdateError) {
        console.error('Error updating user XP:', userUpdateError)
      }
    }

    return NextResponse.json({
      success: true,
      progress: progressData,
      xpEarned,
      message: completed ? 'Lesson completed!' : 'Progress saved!'
    })

  } catch (error) {
    console.error('Error in POST /api/users/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
