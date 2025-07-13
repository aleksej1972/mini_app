'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BookOpen, Play, Star, Trophy, User, Settings, Moon, Sun, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useUser } from '@/contexts/UserContext'

interface Lesson {
  id: string
  title: string
  level: string
  order: number
  description: string
}

interface UserType {
  id: string
  telegram_id: string
  nickname: string
  avatar: string
  level: string
  theme: string
  is_onboarded: boolean
  total_xp: number
  current_streak: number
  last_activity_date: string
}

interface NewHomePageProps {
  user: UserType
}

interface ProgressData {
  user: UserType
  lessons: Lesson[]
  progress: any[]
  stats: {
    totalLessons: number
    completedLessons: number
    totalXP: number
    currentStreak: number
    nextLesson: Lesson | null
  }
}

export function NewHomePage({ user }: NewHomePageProps) {
  const { theme, toggleTheme } = useTheme()
  const { updateUser, logout } = useUser()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    loadUserProgress()
  }, [user.telegram_id])

  const loadUserProgress = async () => {
    try {
      const response = await fetch(`/api/users/progress?telegram_id=${user.telegram_id}`)
      const data = await response.json()

      if (response.ok) {
        setProgressData(data)
      } else {
        console.error('Error loading progress:', data.error)
        // Fallback: загружаем только уроки
        await loadLessonsOnly()
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      await loadLessonsOnly()
    } finally {
      setIsLoading(false)
    }
  }

  const loadLessonsOnly = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()

      if (data.lessons) {
        const userLessons = data.lessons.filter((lesson: Lesson) => lesson.level === user.level)
        setProgressData({
          user,
          lessons: userLessons,
          progress: [],
          stats: {
            totalLessons: userLessons.length,
            completedLessons: 0,
            totalXP: user.total_xp,
            currentStreak: user.current_streak,
            nextLesson: userLessons[0] || null
          }
        })
      }
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    toggleTheme()
    await updateUser({ theme: newTheme })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Загружаем уроки...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{user.avatar}</div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  Привет, {user.nickname}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Уровень: {user.level} • XP: {user.total_xp}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleThemeToggle}
                className="p-2"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
                className="p-2"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Welcome Back Message */}
        {progressData && progressData.stats.completedLessons > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                С возвращением, {user.nickname}! 👋
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ты уже прошел {progressData.stats.completedLessons} из {progressData.stats.totalLessons} уроков.
                {progressData.stats.nextLesson ? ' Продолжай изучение!' : ' Отличная работа!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Profile Card (показывается при клике на User) */}
        {showProfile && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{user.avatar}</div>
              <h2 className="text-xl font-bold mb-2">{user.nickname}</h2>
              <div className="space-y-2 text-sm opacity-90">
                <p>Уровень: {user.level}</p>
                <p>Общий XP: {user.total_xp}</p>
                <p>Текущая серия: {user.current_streak} дней</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="mt-4 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Твой прогресс
              </h2>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {progressData?.stats.totalXP || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {progressData?.stats.completedLessons || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Пройдено</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {progressData?.stats.totalLessons || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Всего уроков</div>
              </div>
            </div>

            {/* Progress Bar */}
            {progressData && progressData.stats.totalLessons > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Прогресс изучения</span>
                  <span>{Math.round((progressData.stats.completedLessons / progressData.stats.totalLessons) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(progressData.stats.completedLessons / progressData.stats.totalLessons) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Lesson Card */}
        {progressData?.stats.nextLesson && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Следующий урок
                </h2>
                <Play className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/lesson/${progressData.stats.nextLesson.id}`}>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                      {progressData.stats.nextLesson.order}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {progressData.stats.nextLesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {progressData.stats.nextLesson.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Начать
                    </span>
                    <Play className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* All Lessons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Все уроки уровня {user.level}
              </h2>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            {!progressData || progressData.lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Пока нет уроков для уровня {user.level}
                </p>
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Добавить уроки
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {progressData.lessons.map((lesson) => {
                  const isCompleted = progressData.progress.some(p => p.lesson_id === lesson.id && p.completed)
                  const isNext = progressData.stats.nextLesson?.id === lesson.id

                  return (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                      <div className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                          : isNext
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            isCompleted
                              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                              : isNext
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            {isCompleted ? '✓' : lesson.order}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCompleted && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              Пройден
                            </span>
                          )}
                          {isNext && (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              Следующий
                            </span>
                          )}
                          <Play className={`h-5 w-5 ${
                            isCompleted ? 'text-green-400' : isNext ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/test-memory-match">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Тест игры
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Админ панель
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
