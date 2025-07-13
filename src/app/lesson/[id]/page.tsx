'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { QuizGame } from '@/components/exercises/QuizGame'
import { FillInTheBlankGame } from '@/components/exercises/FillInTheBlankGame'
import { WordPuzzleGame } from '@/components/exercises/WordPuzzleGame'
import { SentenceBuilderGame } from '@/components/exercises/SentenceBuilderGame'
import { ReadingGame } from '@/components/exercises/ReadingGame'
import { MemoryMatchGame } from '@/components/exercises/MemoryMatchGame'

// Определяем тип Exercise локально
interface Exercise {
  id: string
  lesson_id: string
  type: string
  order: number
  content_json: any
  xp_reward: number
  created_at: string
  updated_at: string
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [userInitialized, setUserInitialized] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Все useEffect должны быть в одном месте для соблюдения правил хуков

  // 1. Проверяем монтирование компонента
  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Инициализируем пользователя при загрузке страницы
  useEffect(() => {
    if (!mounted || userInitialized) return // Ждем монтирования и избегаем повторной инициализации

    const initializeUser = async () => {
      try {
        let telegramId = localStorage.getItem('telegram_user_id')

        if (!telegramId) {
          telegramId = Date.now().toString()
          localStorage.setItem('telegram_user_id', telegramId)
        }

        console.log('Initializing user for lesson page with telegram_id:', telegramId)

        // Получаем пользователя напрямую через API
        const response = await fetch(`/api/users?telegram_id=${telegramId}`)
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          console.log('User loaded for lesson page:', data.user)
        } else {
          console.error('Failed to load user for lesson page')
        }

        setUserInitialized(true)
      } catch (error) {
        console.error('Error initializing user:', error)
        setUserInitialized(true) // Продолжаем даже при ошибке
      }
    }

    initializeUser()
  }, [mounted]) // Убираем userInitialized из зависимостей

  // 3. Загружаем упражнения когда пользователь готов
  useEffect(() => {
    if (lessonId && userInitialized && user) {
      loadExercises()
    }
  }, [lessonId, userInitialized, user])

  // Показываем загрузку пока пользователь не инициализирован
  if (!userInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Загружаем профиль...</p>
        </div>
      </div>
    )
  }

  const loadExercises = async () => {
    try {
      setLoading(true)

      // Загружаем упражнения для конкретного урока через API
      const response = await fetch(`/api/exercises?lesson_id=${lessonId}`)
      const data = await response.json()

      if (response.ok && data.exercises) {
        setExercises(data.exercises)
        console.log('Exercises loaded for lesson:', lessonId, data.exercises)
      } else {
        console.error('Error loading exercises:', data.error)
        setExercises([])
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
      setExercises([])
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseComplete = async (correct: boolean, score?: number) => {
    if (!user) return

    const currentExercise = exercises[currentExerciseIndex]
    
    if (correct && currentExercise) {
      // Сохраняем прогресс упражнения в базу данных
      try {
        if (typeof window === 'undefined') return // Проверка на серверную сторону

        const telegramId = localStorage.getItem('telegram_user_id')
        if (telegramId) {
          const xpEarned = currentExercise.xp_reward || 10

          const response = await fetch('/api/users/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId,
              lessonId,
              exerciseId: currentExercise.id,
              completed: false, // упражнение завершено, но урок еще нет
              xpEarned,
              score
            }),
          })

          if (response.ok) {
            console.log('Exercise progress saved successfully')
            // Обновляем локальное состояние XP
            setTotalXP(prev => prev + xpEarned)
          } else {
            console.error('Failed to save exercise progress')
          }
        }
      } catch (error) {
        console.error('Error saving exercise progress:', error)
      }

      console.log('Exercise completed:', {
        userId: user.id,
        lessonId,
        exerciseId: currentExercise.id,
        score
      })
    }

    // Move to next exercise or complete lesson
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    } else {
      // Урок завершен - сохраняем это в базу данных
      await saveLessonCompletion()
      setCompleted(true)
    }
  }

  const saveLessonCompletion = async () => {
    try {
      if (typeof window === 'undefined') return // Проверка на серверную сторону

      const telegramId = localStorage.getItem('telegram_user_id')
      if (telegramId && user) {
        const xpEarned = 50 // 50 XP за завершение урока

        const response = await fetch('/api/users/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramId,
            lessonId,
            completed: true, // урок завершен
            xpEarned,
            score: 100 // полный балл за завершение урока
          }),
        })

        if (response.ok) {
          console.log('Lesson completion saved successfully')
          // Обновляем локальное состояние XP
          setTotalXP(prev => prev + xpEarned)
        } else {
          console.error('Failed to save lesson completion')
        }
      }
    } catch (error) {
      console.error('Error saving lesson completion:', error)
    }
  }

  const renderExercise = (exercise: Exercise) => {
    const content = exercise.content_json as any

    switch (exercise.type) {
      case 'quiz':
        return (
          <QuizGame
            question={content.question}
            options={content.options}
            correct={content.correct}
            onComplete={handleExerciseComplete}
          />
        )
      case 'fill-in-the-blank':
        return (
          <FillInTheBlankGame
            sentence={content.sentence}
            options={content.options}
            correct={content.correct}
            onComplete={handleExerciseComplete}
          />
        )
      case 'word-puzzle':
        return (
          <WordPuzzleGame
            target={content.target}
            words={content.words}
            onComplete={handleExerciseComplete}
          />
        )
      case 'sentence-builder':
        return (
          <SentenceBuilderGame
            translation={content.translation}
            correctOrder={content.correct_order}
            extraWords={content.extra_words}
            onComplete={handleExerciseComplete}
          />
        )
      case 'reading':
        return (
          <ReadingGame
            text={content.text}
            questions={content.questions}
            onComplete={handleExerciseComplete}
          />
        )
      case 'memory-match':
        return (
          <MemoryMatchGame
            wordPairs={content.word_pairs}
            onComplete={handleExerciseComplete}
          />
        )
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Exercise type "{exercise.type}" not implemented yet.
            </p>
            <Button 
              onClick={() => handleExerciseComplete(true)}
              className="mt-4"
            >
              Skip Exercise
            </Button>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Упражнения не найдены
          </h1>
          <p className="text-gray-600 mb-4">
            В этом уроке пока нет упражнений.
          </p>
          <Link href="/lessons">
            <Button>Назад к урокам</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Урок завершен!
          </h1>
          <p className="text-gray-600 mb-4">
            Отлично! Вы выполнили все упражнения в этом уроке.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              +{totalXP} XP
            </div>
            <div className="text-sm text-gray-600">Опыта получено</div>
          </div>
          <div className="space-y-3">
            <Link href="/lessons">
              <Button className="w-full">
                Назад к урокам
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Главная
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentExercise = exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/lessons">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Упражнение {currentExerciseIndex + 1} из {exercises.length}
              </h1>
            </div>
          </div>
          <ProgressBar
            value={currentExerciseIndex + 1}
            max={exercises.length}
            className="w-full"
          />
        </div>
      </div>

      {/* Exercise Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {renderExercise(currentExercise)}
      </div>
    </div>
  )
}
