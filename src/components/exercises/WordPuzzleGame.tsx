'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { GameResultCard } from '@/components/ui/GameResultCard'
import { triggerHapticFeedback } from '@/lib/telegram'
import { cn } from '@/lib/utils'

interface WordPuzzleGameProps {
  target: string
  words: string[]
  onComplete: (correct: boolean, score?: number) => void
}

export function WordPuzzleGame({ target, words, onComplete }: WordPuzzleGameProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleWordSelect = (word: string) => {
    if (showResult) return
    
    setSelectedWord(word)
    const correct_answer = word === target
    setIsCorrect(correct_answer)
    setShowResult(true)
    
    // Trigger haptic feedback
    triggerHapticFeedback(correct_answer ? 'light' : 'heavy')
    
    // Auto-advance after showing result
    setTimeout(() => {
      onComplete(correct_answer, correct_answer ? 100 : 0)
    }, 1500)
  }

  const handleReset = () => {
    setSelectedWord(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Словесная головоломка
        </h2>
        <p className="text-sm text-gray-600">
          Найдите слово, которое соответствует: <strong>"{target}"</strong>
        </p>
      </div>

      {/* Selected Word Display */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <div className="text-lg text-gray-600 mb-2">Ваш выбор:</div>
          <div
            className={cn(
              'text-2xl font-bold p-4 rounded-lg border-2 border-dashed',
              {
                'bg-green-100 border-green-300 text-green-800': showResult && isCorrect,
                'bg-red-100 border-red-300 text-red-800': showResult && !isCorrect,
                'bg-blue-100 border-blue-300 text-blue-800': !showResult && selectedWord,
                'bg-white border-gray-300 text-gray-400': !showResult && !selectedWord,
              }
            )}
          >
            {selectedWord || 'Выберите слово'}
          </div>
        </CardContent>
      </Card>

      {/* Word Options */}
      <div className="grid grid-cols-2 gap-3">
        {words.map((word, index) => {
          const isCorrectOption = word === target
          const isSelectedOption = word === selectedWord

          return (
            <Button
              key={index}
              variant="outline"
              className={cn('h-12 text-base', {
                'bg-green-100 border-green-300 text-green-800': showResult && isCorrectOption,
                'bg-red-100 border-red-300 text-red-800': showResult && isSelectedOption && !isCorrectOption,
                'opacity-50': showResult && !isCorrectOption && !isSelectedOption,
                'bg-blue-100 border-blue-300 text-blue-800': !showResult && isSelectedOption,
              })}
              onClick={() => handleWordSelect(word)}
              disabled={showResult}
            >
              <div className="flex items-center justify-center">
                <span>{word}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                )}
                {showResult && isSelectedOption && !isCorrectOption && (
                  <XCircle className="h-4 w-4 text-red-600 ml-2" />
                )}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Reset Button */}
      {selectedWord && !showResult && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Сбросить выбор
          </Button>
        </div>
      )}

      {/* Result Message */}
      {showResult && (
        <GameResultCard
          isCorrect={isCorrect}
          correctText="Отлично! Вы нашли правильное слово."
          incorrectText={
            <>Правильный ответ: "{target}".</>
          }
        />
      )}
    </div>
  )
}
