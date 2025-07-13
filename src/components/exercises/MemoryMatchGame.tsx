'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, RotateCcw } from 'lucide-react'
import { triggerHapticFeedback } from '@/lib/telegram'

interface CardData {
  id: string
  text: string
  type: 'english' | 'russian'
  pairId: string
}

interface MemoryMatchGameProps {
  wordPairs: Array<{ english: string; russian: string }>
  onComplete: (correct: boolean, score?: number) => void
}

export function MemoryMatchGame({
  wordPairs,
  onComplete
}: MemoryMatchGameProps) {
  const [cards, setCards] = useState<CardData[]>([])
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [wrongPairs, setWrongPairs] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [score, setScore] = useState(100)
  const [mistakes, setMistakes] = useState(0)

  // Инициализация карточек
  useEffect(() => {
    const gameCards: CardData[] = []
    
    wordPairs.forEach((pair, index) => {
      const pairId = `pair-${index}`
      gameCards.push({
        id: `en-${index}`,
        text: pair.english,
        type: 'english',
        pairId
      })
      gameCards.push({
        id: `ru-${index}`,
        text: pair.russian,
        type: 'russian',
        pairId
      })
    })
    
    // Перемешиваем карточки
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }, [wordPairs])

  // Проверка завершения игры
  useEffect(() => {
    if (matchedPairs.length === wordPairs.length && wordPairs.length > 0) {
      setGameEnded(true)
      setTimeout(() => {
        onComplete(true, score)
      }, 1500)
    }
  }, [matchedPairs.length, wordPairs.length, score, onComplete])

  const startGame = () => {
    setGameStarted(true)
    triggerHapticFeedback('light')
  }

  const resetGame = () => {
    setSelectedCards([])
    setMatchedPairs([])
    setWrongPairs([])
    setGameStarted(false)
    setGameEnded(false)
    setScore(100)
    setMistakes(0)

    // Перемешиваем карточки заново
    const gameCards: CardData[] = []
    wordPairs.forEach((pair, index) => {
      const pairId = `pair-${index}`
      gameCards.push({
        id: `en-${index}`,
        text: pair.english,
        type: 'english',
        pairId
      })
      gameCards.push({
        id: `ru-${index}`,
        text: pair.russian,
        type: 'russian',
        pairId
      })
    })
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)

    triggerHapticFeedback('light')
  }

  const handleCardClick = useCallback((cardId: string) => {
    if (!gameStarted || gameEnded || selectedCards.includes(cardId) || matchedPairs.some(pairId => 
      cards.find(c => c.id === cardId)?.pairId === pairId
    )) {
      return
    }

    const newSelectedCards = [...selectedCards, cardId]
    setSelectedCards(newSelectedCards)

    if (newSelectedCards.length === 2) {
      const [firstCardId, secondCardId] = newSelectedCards
      const firstCard = cards.find(c => c.id === firstCardId)
      const secondCard = cards.find(c => c.id === secondCardId)

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Правильная пара
        triggerHapticFeedback('light')

        // Показываем зеленый цвет на короткое время, затем скрываем карточки
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCard.pairId])
          setSelectedCards([])
        }, 500)
      } else {
        // Неправильная пара - вычитаем очки
        setWrongPairs([firstCardId, secondCardId])
        setMistakes(prev => prev + 1)
        setScore(prev => Math.max(0, prev - 10)) // Штраф 10 очков за ошибку
        triggerHapticFeedback('heavy')

        setTimeout(() => {
          setSelectedCards([])
          setWrongPairs([])
        }, 1000)
      }
    }
  }, [gameStarted, gameEnded, selectedCards, matchedPairs, cards])



  const getCardStyle = (card: CardData) => {
    const isSelected = selectedCards.includes(card.id)
    const isWrong = wrongPairs.includes(card.id)

    // Проверяем, является ли карточка частью правильной пары (показываем зеленый цвет)
    const isCorrectPair = selectedCards.length === 2 &&
                         selectedCards.includes(card.id) &&
                         !wrongPairs.length

    let baseStyle = 'h-20 text-sm font-medium transition-all duration-300 rounded-lg shadow-sm '

    if (isCorrectPair) {
      baseStyle += 'bg-green-100 border-green-300 text-green-800'
    } else if (isWrong) {
      baseStyle += 'bg-red-100 border-red-300 text-red-800'
    } else if (isSelected) {
      baseStyle += 'bg-gray-100 border-gray-400 text-gray-800'
    } else {
      baseStyle += 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
    }

    return baseStyle
  }

  if (!gameStarted) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="text-gray-600 mb-4">
            Найдите пары: английские слова и их русские переводы
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Начальный счёт: 100 очков. За каждую ошибку -10 очков.
          </p>
        </div>

        <Button onClick={startGame} className="px-8 py-3">
          Начать игру
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Заголовок и счет */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Найдите пары слов
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <span>Счёт: {score}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="p-2"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Прогресс */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Найдено пар: {matchedPairs.length} из {wordPairs.length}</span>
        <span>Ошибок: {mistakes}</span>
      </div>

      {/* Игровое поле */}
      <div className="grid grid-cols-2 gap-3 min-h-[280px]">
        {cards
          .filter(card => !matchedPairs.includes(card.pairId))
          .map((card) => (
            <Button
              key={card.id}
              variant="outline"
              className={getCardStyle(card)}
              onClick={() => handleCardClick(card.id)}
              disabled={gameEnded}
            >
              <div className="text-center px-2">
                <div className="font-medium">{card.text}</div>
              </div>
            </Button>
          ))}
      </div>

      {/* Результат игры */}
      {gameEnded && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1 text-green-800">
              Отлично!
            </h3>
            <p className="text-sm text-green-700">
              Вы нашли все пары! Итоговый счёт: {score} очков
            </p>
            {mistakes > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Ошибок: {mistakes}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
