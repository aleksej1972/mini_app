'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { CheckCircle, XCircle, BookOpen } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

interface Question {
  question: string
  options: string[]
  correct: string
}

interface ReadingGameProps {
  text: string
  questions: Question[]
  onComplete: (correct: boolean, score?: number) => void
}

export function ReadingGame({ text, questions, onComplete }: ReadingGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showText, setShowText] = useState(true)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    
    const correct_answer = answer === currentQuestion.correct
    setIsCorrect(correct_answer)
    setShowResult(true)
    
    // Store the answer
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(newAnswers)
    
    // Trigger haptic feedback
    triggerHapticFeedback(correct_answer ? 'light' : 'heavy')
    
    // Auto-advance after showing result
    setTimeout(() => {
      if (isLastQuestion) {
        // Calculate final score
        const correctCount = newAnswers.filter((answer, index) => 
          answer === questions[index].correct
        ).length
        const score = Math.round((correctCount / questions.length) * 100)
        onComplete(correctCount > 0, score)
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1)
        setShowResult(false)
        setIsCorrect(false)
      }
    }, 1500)
  }

  const toggleTextView = () => {
    setShowText(!showText)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Понимание прочитанного
        </h2>
        <p className="text-sm text-gray-600">
          Вопрос {currentQuestionIndex + 1} из {questions.length}
        </p>
      </div>

      {/* Text Toggle Button */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTextView}
          className="mb-4"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {showText ? 'Скрыть текст' : 'Показать текст'}
        </Button>
      </div>

      {/* Reading Text */}
      {showText && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Текст для чтения</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-800 leading-relaxed">
              {text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = 'w-full text-left justify-start h-auto py-3 px-4'
              let icon = null

              if (showResult) {
                if (option === currentQuestion.correct) {
                  buttonClass += ' bg-green-100 border-green-300 text-green-800'
                  icon = <CheckCircle className="h-5 w-5 text-green-600" />
                } else if (option === selectedAnswers[currentQuestionIndex] && option !== currentQuestion.correct) {
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
                  onClick={() => handleAnswerSelect(option)}
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
        </CardContent>
      </Card>

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
                ? isLastQuestion
                  ? 'Отлично! Вы завершили упражнение по чтению!'
                  : 'Хорошо! Переходим к следующему вопросу.'
                : `Правильный ответ: "${currentQuestion.correct}".`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < currentQuestionIndex
                ? 'bg-green-500'
                : index === currentQuestionIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
