'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

interface SentenceBuilderGameProps {
  translation: string
  correctOrder: string[]
  extraWords: string[]
  onComplete: (correct: boolean, score?: number) => void
}

export function SentenceBuilderGame({ 
  translation, 
  correctOrder, 
  extraWords, 
  onComplete 
}: SentenceBuilderGameProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([
    ...correctOrder,
    ...extraWords
  ].sort(() => Math.random() - 0.5)) // Shuffle words
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleWordSelect = (word: string) => {
    if (showResult) return
    
    setSelectedWords(prev => [...prev, word])
    setAvailableWords(prev => prev.filter(w => w !== word))
  }

  const handleWordRemove = (index: number) => {
    if (showResult) return
    
    const word = selectedWords[index]
    setSelectedWords(prev => prev.filter((_, i) => i !== index))
    setAvailableWords(prev => [...prev, word])
  }

  const handleCheck = () => {
    const correct_answer = JSON.stringify(selectedWords) === JSON.stringify(correctOrder)
    setIsCorrect(correct_answer)
    setShowResult(true)
    
    // Trigger haptic feedback
    triggerHapticFeedback(correct_answer ? 'light' : 'heavy')
    
    // Auto-advance after showing result
    setTimeout(() => {
      onComplete(correct_answer, correct_answer ? 100 : 0)
    }, 2000)
  }

  const handleReset = () => {
    setSelectedWords([])
    setAvailableWords([...correctOrder, ...extraWords].sort(() => Math.random() - 0.5))
    setShowResult(false)
    setIsCorrect(false)
  }

  const canCheck = selectedWords.length === correctOrder.length

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Составитель предложений
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Составьте английское предложение для:
        </p>
        <p className="text-lg font-medium text-blue-600">
          "{translation}"
        </p>
      </div>

      {/* Sentence Building Area */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="text-sm text-gray-600 mb-2">Ваше предложение:</div>
          <div className={`min-h-[60px] p-3 rounded-lg border-2 border-dashed flex flex-wrap gap-2 items-center ${
            showResult
              ? isCorrect
                ? 'bg-green-100 border-green-300'
                : 'bg-red-100 border-red-300'
              : 'bg-white border-gray-300'
          }`}>
            {selectedWords.length === 0 ? (
              <span className="text-gray-400 italic">Нажмите на слова ниже, чтобы составить предложение</span>
            ) : (
              selectedWords.map((word, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`${
                    showResult
                      ? isCorrect
                        ? 'bg-green-200 border-green-400 text-green-800'
                        : 'bg-red-200 border-red-400 text-red-800'
                      : 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                  }`}
                  onClick={() => handleWordRemove(index)}
                  disabled={showResult}
                >
                  {word}
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Words */}
      <div>
        <div className="text-sm text-gray-600 mb-3">Доступные слова:</div>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleWordSelect(word)}
              disabled={showResult}
              className="hover:bg-gray-100"
            >
              {word}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResult && (
          <>
            <Button
              onClick={handleCheck}
              disabled={!canCheck}
              className="flex-1"
            >
              Проверить ответ
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={selectedWords.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

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
              {isCorrect ? 'Отлично!' : 'Не совсем правильно'}
            </h3>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? 'Вы правильно составили предложение!'
                : `Правильный порядок: "${correctOrder.join(' ')}"`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
