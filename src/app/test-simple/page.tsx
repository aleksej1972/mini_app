'use client'

import React from 'react'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Sun, Moon, User, Home } from 'lucide-react'
import Link from 'next/link'

export default function TestSimplePage() {
  const { user, isLoading } = useUser()
  const { theme, toggleTheme } = useTheme()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Загружаем...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Тестовая страница
              </h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
                <Link href="/">
                  <Button variant="outline" size="sm" className="p-2">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Информация о пользователе
            </h2>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.nickname}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Уровень: {user.level}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {user.total_xp}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">XP</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {user.current_streak}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Дней</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <p>ID: {user.id}</p>
                  <p>Telegram ID: {user.telegram_id}</p>
                  <p>Тема: {user.theme}</p>
                  <p>Зарегистрирован: {user.is_onboarded ? 'Да' : 'Нет'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  Пользователь не найден
                </p>
                <Link href="/welcome">
                  <Button className="mt-3">
                    Зарегистрироваться
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme Test */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Тест темы
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                Текущая тема: <span className="font-medium">{theme}</span>
              </p>
              <Button onClick={toggleTheme} className="w-full">
                Переключить тему
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded text-center">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">Синий</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded text-center">
                  <p className="text-green-800 dark:text-green-200 text-sm">Зеленый</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded text-center">
                  <p className="text-red-800 dark:text-red-200 text-sm">Красный</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded text-center">
                  <p className="text-purple-800 dark:text-purple-200 text-sm">Фиолетовый</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Навигация
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Главная страница
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  Админ панель
                </Button>
              </Link>
              <Link href="/test-memory-match">
                <Button variant="outline" className="w-full">
                  Тест Memory Match
                </Button>
              </Link>
              <Link href="/welcome">
                <Button variant="outline" className="w-full">
                  Страница приветствия
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
