'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

interface QuizGameProps {
  question: string
  options: string[]
  correct: string
  onComplete: (correct: boolean, score?: number) => void
}

export function QuizGame({ question, options, correct, onComplete }: QuizGameProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleOptionSelect = (option: string) => {
    if (showResult) return
    
    setSelectedOption(option)
    const correct_answer = option === correct
    setIsCorrect(correct_answer)
    setShowResult(true)
    
    // Trigger haptic feedback
    triggerHapticFeedback(correct_answer ? 'light' : 'heavy')
    
    // Auto-advance after showing result
    setTimeout(() => {
      onComplete(correct_answer, correct_answer ? 100 : 0)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Вопрос викторины
        </h2>
        <p className="text-lg text-gray-700">
          {question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          let buttonClass = 'w-full text-left justify-start h-auto py-4 px-4'
          let icon = null

          if (showResult) {
            if (option === correct) {
              buttonClass += ' bg-green-100 border-green-300 text-green-800'
              icon = <CheckCircle className="h-5 w-5 text-green-600" />
            } else if (option === selectedOption && option !== correct) {
              buttonClass += ' bg-red-100 border-red-300 text-red-800'
              icon = <XCircle className="h-5 w-5 text-red-600" />
            } else {
              buttonClass += ' opacity-50'
            }
          } else {
            buttonClass += ' hover:bg-gray-50 border-gray-300'
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonClass}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">{option}</span>
                {icon}
              </div>
            </Button>
          )
        })}
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
              {isCorrect ? 'Правильно!' : 'Неправильно'}
            </h3>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? 'Отлично! Вы ответили правильно.'
                : `Правильный ответ: "${correct}".`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
