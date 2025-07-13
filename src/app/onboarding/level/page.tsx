'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { GraduationCap, Star, Award, Crown, Zap, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

const LEVELS = [
  {
    code: 'A1',
    name: 'Начинающий',
    description: 'Изучаю первые слова и фразы',
    icon: Star,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700'
  },
  {
    code: 'A2',
    name: 'Элементарный',
    description: 'Понимаю простые предложения',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700'
  },
  {
    code: 'B1',
    name: 'Средний',
    description: 'Могу поддержать разговор',
    icon: Award,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700'
  },
  {
    code: 'B2',
    name: 'Выше среднего',
    description: 'Свободно выражаю мысли',
    icon: Zap,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700'
  },
  {
    code: 'C1',
    name: 'Продвинутый',
    description: 'Понимаю сложные тексты',
    icon: Crown,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-700'
  },
  {
    code: 'C2',
    name: 'Профессиональный',
    description: 'Владею языком в совершенстве',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-700'
  }
]

export default function LevelPage() {
  const router = useRouter()
  const { createUser } = useUser()
  const [selectedLevel, setSelectedLevel] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleComplete = async () => {
    if (!selectedLevel) return

    setIsCreating(true)
    try {
      // Получаем данные из localStorage
      if (typeof window === 'undefined') return

      const nickname = localStorage.getItem('onboarding_nickname')
      const avatar = localStorage.getItem('onboarding_avatar')
      const telegramId = localStorage.getItem('telegram_user_id') || Date.now().toString()

      if (!nickname || !avatar) {
        alert('Ошибка: отсутствуют данные профиля. Начните заново.')
        router.push('/welcome')
        return
      }

      // Создаем пользователя через контекст
      await createUser({
        telegramId,
        nickname,
        avatar,
        level: selectedLevel,
        theme: 'light'
      })

      // Очищаем временные данные
      localStorage.removeItem('onboarding_nickname')
      localStorage.removeItem('onboarding_avatar')

      console.log('User created successfully')

      // Переходим на главную страницу
      router.push('/')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Ошибка создания профиля')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <div className="mb-4">
              <GraduationCap className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Выбери свой уровень
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Это поможет подобрать подходящие уроки
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {LEVELS.map((level) => {
            const IconComponent = level.icon
            const isSelected = selectedLevel === level.code
            
            return (
              <Card
                key={level.code}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? `${level.bgColor} ${level.borderColor} border-2 shadow-lg`
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md'
                }`}
                onClick={() => setSelectedLevel(level.code)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${level.color} mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {level.code} - {level.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {level.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Button
              onClick={handleComplete}
              disabled={!selectedLevel || isCreating}
              className="w-full py-3 text-lg font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Создаем профиль...
                </>
              ) : (
                'Начать изучение! 🚀'
              )}
            </Button>
            
            {selectedLevel && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">
                Выбран уровень: <span className="font-medium">{selectedLevel}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
