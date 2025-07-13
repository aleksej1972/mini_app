'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BookOpen, Trophy, Target, Play } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { user, isLoading, isFirstTime, checkUser } = useUser()
  const [initialized, setInitialized] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Проверяем, что компонент смонтирован на клиенте
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || initialized) return // Ждем монтирования и избегаем повторной инициализации

    const initializeApp = async () => {
      try {
        // Получаем telegram_id из localStorage или создаем новый
        let telegramId = localStorage.getItem('telegram_user_id')

        if (!telegramId) {
          telegramId = Date.now().toString()
          localStorage.setItem('telegram_user_id', telegramId)
        }

        console.log('Initializing app with telegram_id:', telegramId)
        await checkUser(telegramId)

        // Загружаем актуальный прогресс пользователя
        if (telegramId) {
          await loadUserProgress(telegramId)
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setInitialized(true)
      }
    }

    initializeApp()
  }, [mounted]) // Убираем checkUser и initialized из зависимостей

  const loadUserProgress = async (telegramId: string) => {
    try {
      const response = await fetch(`/api/users/progress?telegram_id=${telegramId}`)
      if (response.ok) {
        const data = await response.json()
        // Обновляем данные пользователя с актуальным прогрессом
        if (data.user && data.stats) {
          console.log('Updated user progress:', data.stats)
        }
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    }
  }

  // Перенаправляем новых пользователей на регистрацию
  useEffect(() => {
    if (initialized && !isLoading && isFirstTime) {
      console.log('New user detected, redirecting to welcome')
      router.push('/welcome')
    }
  }, [initialized, isLoading, isFirstTime, router])

  // Показываем загрузку пока приложение инициализируется
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-300 mt-4">Загружаем ваш профиль...</p>
        </div>
      </div>
    )
  }

  // Если пользователь не найден, показываем кнопку для регистрации
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Добро пожаловать!
            </h1>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Начните изучение английского языка прямо сейчас
            </p>
            <Button 
              onClick={() => router.push('/welcome')}
              className="w-full"
            >
              Начать изучение
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Главная страница для зарегистрированных пользователей
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Приветствие пользователя */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">{user.avatar}</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Привет, {user.nickname}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Уровень: {user.level}
                </p>
              </div>
            </div>
            
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {user.total_xp}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">XP</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {user.current_streak}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Дней</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Быстрые действия */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Продолжить изучение
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => router.push('/lessons')}
              className="w-full flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Уроки</span>
            </Button>
            <Button 
              onClick={() => router.push('/test-memory-match')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Игры</span>
            </Button>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
