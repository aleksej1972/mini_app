'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { User, Check, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const AVATARS = [
  '👤', '🧑', '👩', '🧔', '👱', '🧑‍🦰', '👩‍🦰', '🧑‍🦱', '👩‍🦱', '🧑‍🦲',
  '👩‍🦲', '🧓', '👴', '👵', '🙂', '😊', '😎', '🤓', '🥸', '🤠'
]

export default function NicknamePage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [isChecking, setIsChecking] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Проверка никнейма с задержкой
  useEffect(() => {
    if (nickname.length < 3) {
      setNicknameStatus('idle')
      return
    }

    const timeoutId = setTimeout(async () => {
      await checkNickname(nickname)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [nickname])

  const checkNickname = async (nicknameToCheck: string) => {
    setIsChecking(true)
    try {
      const telegramId = localStorage.getItem('telegram_user_id')
      const url = `/api/users/check-nickname?nickname=${encodeURIComponent(nicknameToCheck)}${telegramId ? `&telegram_id=${telegramId}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.available) {
        setNicknameStatus('available')
        setErrorMessage('')
      } else {
        setNicknameStatus(data.error.includes('characters') || data.error.includes('contain') ? 'invalid' : 'taken')
        setErrorMessage(data.error)
      }
    } catch (error) {
      console.error('Error checking nickname:', error)
      setNicknameStatus('invalid')
      setErrorMessage('Ошибка проверки никнейма')
    } finally {
      setIsChecking(false)
    }
  }

  const handleNext = () => {
    if (nicknameStatus === 'available' && selectedAvatar) {
      // Сохраняем данные в localStorage для следующего шага
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding_nickname', nickname)
        localStorage.setItem('onboarding_avatar', selectedAvatar)
      }
      router.push('/onboarding/level')
    }
  }

  const getNicknameInputStyle = () => {
    if (isChecking) return 'border-yellow-300 focus:ring-yellow-500'
    if (nicknameStatus === 'available') return 'border-green-300 focus:ring-green-500'
    if (nicknameStatus === 'taken' || nicknameStatus === 'invalid') return 'border-red-300 focus:ring-red-500'
    return 'border-gray-300 focus:ring-blue-500'
  }

  const getNicknameIcon = () => {
    if (isChecking) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
    if (nicknameStatus === 'available') return <Check className="h-5 w-5 text-green-500" />
    if (nicknameStatus === 'taken' || nicknameStatus === 'invalid') return <X className="h-5 w-5 text-red-500" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <User className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Создай свой профиль
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Выбери никнейм и аватар
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Никнейм */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Никнейм
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getNicknameInputStyle()} dark:bg-gray-700 dark:text-white`}
                  placeholder="Введи свой никнейм"
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getNicknameIcon()}
                </div>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorMessage}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                3-20 символов, только буквы, цифры, _ и -
              </p>
            </div>

            {/* Выбор аватара */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Выбери аватар
              </label>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedAvatar === avatar
                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Предпросмотр */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{selectedAvatar}</div>
              <p className="font-medium text-gray-900 dark:text-white">
                {nickname || 'Твой никнейм'}
              </p>
            </div>

            {/* Кнопка далее */}
            <Button
              onClick={handleNext}
              disabled={nicknameStatus !== 'available' || !selectedAvatar}
              className="w-full py-3 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
