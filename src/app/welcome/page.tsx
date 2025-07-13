'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { BookOpen, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  const handleYes = () => {
    router.push('/onboarding/nickname')
  }

  const handleNo = () => {
    // Можно добавить аналитику или просто закрыть приложение
    window.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Иконка */}
            <div className="mb-6">
              <div className="relative inline-flex">
                <BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>

            {/* Заголовок */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Привет! 👋
            </h1>

            {/* Описание */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Готов изучать английский язык в увлекательной форме?
            </p>

            {/* Кнопки */}
            <div className="space-y-4">
              <Button
                onClick={handleYes}
                className="w-full py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Да, начнем! 🚀
              </Button>
              
              <Button
                onClick={handleNo}
                variant="outline"
                className="w-full py-3 text-lg font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Пока нет
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Изучай английский через игры, викторины и интерактивные упражнения
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
