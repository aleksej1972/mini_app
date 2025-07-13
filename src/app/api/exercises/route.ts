import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - получить упражнения (все или по lesson_id)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lesson_id')

    let query = supabase
      .from('exercises')
      .select(`
        *,
        lessons (
          id,
          title,
          level
        )
      `)

    // Если указан lesson_id, фильтруем по нему
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data: exercises, error } = await query.order('lesson_id, order')

    if (error) {
      console.error('Error fetching exercises:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('Error in GET /api/exercises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - создать новое упражнение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, type, order, content, xpReward = 10 } = body

    // Валидация
    if (!lessonId || !type || !order || !content) {
      return NextResponse.json(
        { error: 'All fields are required: lessonId, type, order, content' },
        { status: 400 }
      )
    }

    // Валидация JSON контента
    let parsedContent
    try {
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format in content' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли урок
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Проверяем, не существует ли уже упражнение с таким порядком в этом уроке
    const { data: existingExercise } = await supabase
      .from('exercises')
      .select('id')
      .eq('lesson_id', lessonId)
      .eq('order', order)
      .single()

    if (existingExercise) {
      return NextResponse.json(
        { error: `Exercise with order ${order} already exists for this lesson` },
        { status: 400 }
      )
    }

    // Создаем упражнение
    const { data: exercise, error } = await supabase
      .from('exercises')
      .insert([{
        lesson_id: lessonId,
        type,
        order: parseInt(order),
        content_json: parsedContent,
        xp_reward: parseInt(xpReward)
      }])
      .select(`
        *,
        lessons (
          id,
          title,
          level
        )
      `)
      .single()

    if (error) {
      console.error('Error creating exercise:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exercise }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/exercises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
