'use client'

import React, { useEffect, useState } from 'react'
import { Database } from '@/lib/database.types'
import { getAllLessons, calculateLevel, getXPForNextLevel } from '@/lib/database'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BookOpen, Trophy, Star } from 'lucide-react'
import Link from 'next/link'

type User = Database['public']['Tables']['users']['Row']
type Lesson = Database['public']['Tables']['lessons']['Row']

interface HomePageProps {
  user: User
}

export function HomePage({ user }: HomePageProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      const allLessons = await getAllLessons()
      setLessons(allLessons)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentLevel = calculateLevel(user.xp)
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const progressToNextLevel = user.xp % 100 // Simplified progress calculation

  // Group lessons by level
  const lessonsByLevel = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.level]) {
      acc[lesson.level] = []
    }
    acc[lesson.level].push(lesson)
    return acc
  }, {} as Record<string, Lesson[]>)

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Привет, {user.first_name}!
              </h1>
              <p className="text-sm text-gray-600">Готов изучать английский?</p>
            </div>
            <LevelBadge level={currentLevel} />
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user.xp} XP
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {nextLevelXP - user.xp} XP до следующего уровня
              </span>
            </div>
            <ProgressBar
              value={progressToNextLevel}
              max={100}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {lessons.length}
                  </div>
                  <div className="text-sm text-gray-600">Уроков</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {user.xp}
                  </div>
                  <div className="text-sm text-gray-600">Всего XP</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link href="/register">
                <Button variant="outline" size="sm" className="w-full">
                  Демо регистрации
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="sm" className="w-full">
                  Как это работает
                </Button>
              </Link>
            </div>

            {/* Lessons by Level */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Выберите ваш уровень
              </h2>
              
              {levels.map((level) => {
                const levelLessons = lessonsByLevel[level] || []
                const isUnlocked = level <= currentLevel || level === 'A1'
                
                return (
                  <Card
                    key={level}
                    className={`${
                      isUnlocked
                        ? 'cursor-pointer hover:shadow-md transition-shadow'
                        : 'opacity-50'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <LevelBadge level={level} />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Level {level}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {levelLessons.length} уроков
                            </p>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <Link href={`/lessons?level=${level}`}>
                            <Button size="sm">Начать</Button>
                          </Link>
                        ) : (
                          <Button size="sm" disabled>
                            Заблокировано
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    {levelLessons.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {levelLessons.slice(0, 3).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="text-sm text-gray-600 flex items-center space-x-2"
                            >
                              <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              <span>{lesson.title}</span>
                            </div>
                          ))}
                          {levelLessons.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{levelLessons.length - 3} еще уроков
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
