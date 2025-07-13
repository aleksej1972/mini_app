import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - получить все уроки
export async function GET() {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .order('level, order')

    if (error) {
      console.error('Error fetching lessons:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error in GET /api/lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - создать новый урок
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, level, order, description } = body

    // Валидация
    if (!title || !level || !order || !description) {
      return NextResponse.json(
        { error: 'All fields are required: title, level, order, description' },
        { status: 400 }
      )
    }

    // Проверяем, не существует ли уже урок с таким порядком в этом уровне
    const { data: existingLesson } = await supabase
      .from('lessons')
      .select('id')
      .eq('level', level)
      .eq('order', order)
      .single()

    if (existingLesson) {
      return NextResponse.json(
        { error: `Lesson with order ${order} already exists for level ${level}` },
        { status: 400 }
      )
    }

    // Создаем урок
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([{
        title,
        level,
        order: parseInt(order),
        description
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating lesson:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
