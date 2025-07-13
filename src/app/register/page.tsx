'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { getTelegramUser, initTelegramWebApp } from '@/lib/telegram'
import { createUser, getUserByTelegramId } from '@/lib/database'
import { CheckCircle, User, Zap, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState<'loading' | 'telegram-data' | 'creating' | 'complete'>('loading')
  const [telegramUser, setTelegramUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeRegistration()
  }, [])

  const initializeRegistration = async () => {
    try {
      setStep('loading')
      
      // Initialize Telegram WebApp
      const telegramInitialized = initTelegramWebApp()
      console.log('Telegram initialized:', telegramInitialized)
      
      // Get Telegram user data
      const tgUser = getTelegramUser()
      console.log('Telegram user:', tgUser)
      
      if (tgUser) {
        setTelegramUser(tgUser)
        setStep('telegram-data')
      } else {
        // For development, create mock user
        const mockUser = {
          id: 123456789,
          first_name: 'Demo',
          last_name: 'User',
          username: 'demouser'
        }
        setTelegramUser(mockUser)
        setStep('telegram-data')
      }
    } catch (err) {
      console.error('Registration initialization error:', err)
      setError('Failed to initialize registration')
    }
  }

  const handleRegistration = async () => {
    if (!telegramUser) return
    
    try {
      setStep('creating')
      setError(null)
      
      // Check if user already exists
      let user = await getUserByTelegramId(telegramUser.id)
      
      if (!user) {
        // Create new user
        user = await createUser({
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null,
          level: 'A1',
          xp: 0
        })
      }
      
      if (user) {
        setDbUser(user)
        setStep('complete')
      } else {
        throw new Error('Failed to create user account')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Failed to create account. Please try again.')
      setStep('telegram-data')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'loading':
        return (
          <Card className="text-center">
            <CardContent className="p-8">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Подключение к Telegram...
              </h2>
              <p className="text-gray-600">
                Получаем информацию вашего профиля Telegram
              </p>
            </CardContent>
          </Card>
        )

      case 'telegram-data':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Добро пожаловать в изучение английского!
                  </h2>
                  <p className="text-gray-600">
                    Мы нашли ваш профиль Telegram
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Ваш профиль:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Имя:</span>
                    <span className="font-medium">
                      {telegramUser?.first_name} {telegramUser?.last_name}
                    </span>
                  </div>
                  {telegramUser?.username && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">@{telegramUser.username}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telegram ID:</span>
                    <span className="font-medium">{telegramUser?.id}</span>
                  </div>
                </div>
              </div>

              {/* What you'll get */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Что вы получите:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Доступ к 15+ урокам английского</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">Система XP и отслеживание прогресса</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <LevelBadge level="A1" />
                    <span className="text-gray-700">Прогрессия уровней CEFR (A1 до C2)</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleRegistration}
                className="w-full"
                size="lg"
              >
                Создать мой аккаунт
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )

      case 'creating':
        return (
          <Card className="text-center">
            <CardContent className="p-8">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Creating Your Account...
              </h2>
              <p className="text-gray-600">
                Setting up your learning profile
              </p>
            </CardContent>
          </Card>
        )

      case 'complete':
        return (
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome aboard! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully
              </p>

              {/* User Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">A1</div>
                    <div className="text-sm text-gray-600">Starting Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">XP Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">Lessons Available</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full" size="lg">
                    Start Learning English!
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/lessons?level=A1">
                  <Button variant="outline" className="w-full">
                    Browse A1 Lessons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">English Learning</h1>
            <p className="text-gray-600">Telegram Mini App</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {renderStep()}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-md mx-auto px-4 py-4">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Debug Info:</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>Step: {step}</div>
                <div>Telegram User: {telegramUser ? 'Found' : 'Not found'}</div>
                <div>DB User: {dbUser ? 'Created' : 'Not created'}</div>
                {error && <div>Error: {error}</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
