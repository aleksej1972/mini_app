'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

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
          <div className={`text-2xl font-bold p-4 rounded-lg border-2 border-dashed ${
            selectedWord
              ? showResult
                ? isCorrect
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-red-100 border-red-300 text-red-800'
                : 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {selectedWord || 'Выберите слово'}
          </div>
        </CardContent>
      </Card>

      {/* Word Options */}
      <div className="grid grid-cols-2 gap-3">
        {words.map((word, index) => {
          let buttonClass = 'h-12 text-base'
          let icon = null

          if (showResult) {
            if (word === target) {
              buttonClass += ' bg-green-100 border-green-300 text-green-800'
              icon = <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
            } else if (word === selectedWord && word !== target) {
              buttonClass += ' bg-red-100 border-red-300 text-red-800'
              icon = <XCircle className="h-4 w-4 text-red-600 ml-2" />
            } else {
              buttonClass += ' opacity-50'
            }
          } else if (word === selectedWord) {
            buttonClass += ' bg-blue-100 border-blue-300 text-blue-800'
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonClass}
              onClick={() => handleWordSelect(word)}
              disabled={showResult}
            >
              <div className="flex items-center justify-center">
                <span>{word}</span>
                {icon}
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
        <Card className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {isCorrect ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h3 className={`font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Правильно!' : 'Неправильно'}
            </h3>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? 'Отлично! Вы нашли правильное слово.'
                : `Правильный ответ: "${target}".`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
