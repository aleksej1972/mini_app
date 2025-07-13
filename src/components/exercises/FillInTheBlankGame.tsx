'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

interface FillInTheBlankGameProps {
  sentence: string
  options: string[]
  correct: string
  onComplete: (correct: boolean, score?: number) => void
}

export function FillInTheBlankGame({ 
  sentence, 
  options, 
  correct, 
  onComplete 
}: FillInTheBlankGameProps) {
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

  // Split sentence by blank (represented by ___)
  const renderSentence = () => {
    const parts = sentence.split('___')
    if (parts.length !== 2) {
      // Fallback if sentence doesn't have exactly one blank
      return (
        <span className="text-lg">
          {sentence.replace('___', `[${selectedOption || '___'}]`)}
        </span>
      )
    }

    return (
      <span className="text-lg">
        {parts[0]}
        <span className={`inline-block min-w-[80px] px-2 py-1 mx-1 rounded border-2 border-dashed text-center font-medium ${
          showResult
            ? isCorrect
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-red-100 border-red-300 text-red-800'
            : selectedOption
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-gray-100 border-gray-300 text-gray-500'
        }`}>
          {selectedOption || '___'}
        </span>
        {parts[1]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Заполните пропуск
        </h2>
        <p className="text-sm text-gray-600">
          Выберите правильное слово для завершения предложения
        </p>
      </div>

      {/* Sentence with blank */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          {renderSentence()}
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => {
          let buttonClass = 'h-12'
          let icon = null

          if (showResult) {
            if (option === correct) {
              buttonClass += ' bg-green-100 border-green-300 text-green-800'
              icon = <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
            } else if (option === selectedOption && option !== correct) {
              buttonClass += ' bg-red-100 border-red-300 text-red-800'
              icon = <XCircle className="h-4 w-4 text-red-600 ml-2" />
            } else {
              buttonClass += ' opacity-50'
            }
          } else if (option === selectedOption) {
            buttonClass += ' bg-blue-100 border-blue-300 text-blue-800'
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonClass}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
            >
              <div className="flex items-center justify-center">
                <span>{option}</span>
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
                ? 'Отлично! Вы правильно заполнили пропуск.'
                : `Правильный ответ: "${correct}".`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
