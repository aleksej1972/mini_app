'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, Trophy, CheckCircle } from 'lucide-react'
import { getLessonsByLevel } from '@/lib/database'
import { Database } from '@/lib/database.types'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type Lesson = Database['public']['Tables']['lessons']['Row']

export default function LessonsPage() {
  const searchParams = useSearchParams()
  const level = searchParams.get('level') || 'A1'
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadLessons()
    loadUserProgress()
  }, [level])

  const loadLessons = async () => {
    try {
      setLoading(true)
      const levelLessons = await getLessonsByLevel(level)
      setLessons(levelLessons)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProgress = async () => {
    try {
      if (typeof window === 'undefined') return // Проверка на серверную сторону

      const telegramId = localStorage.getItem('telegram_user_id')
      if (!telegramId) return

      const response = await fetch(`/api/users/progress?telegram_id=${telegramId}`)
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data.progress || [])
        setUserStats(data.stats || null)
        console.log('User progress loaded:', data)
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.completed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <LevelBadge level={level} />
                <h1 className="text-lg font-semibold text-gray-900">
                  Уроки уровня {level}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Нет доступных уроков
            </h2>
            <p className="text-gray-600">
              Уроки для уровня {level} скоро появятся!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id)
              return (
                <Card key={lesson.id} className={`hover:shadow-md transition-shadow ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-blue-600">
                            Урок {lesson.order}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <h3 className={`font-semibold mb-1 ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                            {lesson.description}
                          </p>
                        )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>~10 мин</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4" />
                        <span>50 XP</span>
                      </div>
                    </div>
                    <Link href={`/lesson/${lesson.id}`}>
                      <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                        {isCompleted ? 'Повторить' : 'Начать урок'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
