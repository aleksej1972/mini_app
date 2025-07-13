'use client'

import React, { useState } from 'react'
import { MemoryMatchGame } from '@/components/exercises/MemoryMatchGame'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function TestMemoryMatchPage() {
  const [gameKey, setGameKey] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [gameResult, setGameResult] = useState<{score: number, show: boolean} | null>(null)

  const wordPairsByLevel = {
    'A1': [
      { english: "Hello", russian: "Привет" },
      { english: "Good morning", russian: "Доброе утро" },
      { english: "Thank you", russian: "Спасибо" },
      { english: "Please", russian: "Пожалуйста" },
      { english: "Goodbye", russian: "До свидания" },
      { english: "Yes", russian: "Да" }
    ],
    'A2': [
      { english: "Family", russian: "Семья" },
      { english: "House", russian: "Дом" },
      { english: "School", russian: "Школа" },
      { english: "Friend", russian: "Друг" },
      { english: "Work", russian: "Работа" },
      { english: "Food", russian: "Еда" }
    ],
    'B1': [
      { english: "Experience", russian: "Опыт" },
      { english: "Important", russian: "Важный" },
      { english: "Difficult", russian: "Трудный" },
      { english: "Interesting", russian: "Интересный" },
      { english: "Beautiful", russian: "Красивый" },
      { english: "Successful", russian: "Успешный" }
    ]
  }



  const handleGameComplete = (correct: boolean, score?: number) => {
    console.log('Game completed:', { correct, score })
    setGameResult({ score: score || 0, show: true })
  }

  const handleCloseModal = () => {
    console.log('Closing modal')
    setGameResult(null)
  }

  const resetGame = () => {
    setGameKey(prev => prev + 1)
    setGameResult(null)
  }

  const startNewGame = () => {
    setGameResult(null)
    setGameKey(prev => prev + 1)
  }

  const changeLevel = (level: string) => {
    setSelectedLevel(level)
    setGameKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            Тест игры Memory Match
          </h1>
        </div>

        {/* Level Selector */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">Выберите уровень:</h3>
            <div className="flex gap-2">
              {Object.keys(wordPairsByLevel).map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeLevel(level)}
                  className="flex-1"
                >
                  {level}
                </Button>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Перезапустить игру
          </Button>
        </div>

        {/* Game Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-lg font-medium text-gray-800">
              Уровень {selectedLevel}
            </h2>
          </CardHeader>
          <CardContent>
            <MemoryMatchGame
              key={gameKey}
              wordPairs={wordPairsByLevel[selectedLevel as keyof typeof wordPairsByLevel]}
              onComplete={handleGameComplete}
            />
          </CardContent>
        </Card>

        {/* Модальное окно с результатом */}
        {gameResult?.show && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              // Закрываем модальное окно при клике по фону
              if (e.target === e.currentTarget) {
                handleCloseModal()
              }
            }}
          >
            <Card
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике по карточке
            >
              <CardHeader>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Отлично!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Вы нашли все пары!
                  </p>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {gameResult.score} очков
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      startNewGame()
                    }}
                    className="w-full"
                  >
                    Играть еще раз
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCloseModal()
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Закрыть
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
