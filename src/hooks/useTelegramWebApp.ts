'use client'

import { useEffect, useState } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    chat_instance?: string
    chat_type?: string
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    link_color: string
    button_color: string
    button_text_color: string
    secondary_bg_color: string
    hint_color: string
    bg_color: string
    text_color: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  BackButton: {
    isVisible: boolean
    show(): void
    hide(): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText(text: string): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
    show(): void
    hide(): void
    enable(): void
    disable(): void
    showProgress(leaveActive?: boolean): void
    hideProgress(): void
    setParams(params: {
      text?: string
      color?: string
      text_color?: string
      is_active?: boolean
      is_visible?: boolean
    }): void
  }
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
    notificationOccurred(type: 'error' | 'success' | 'warning'): void
    selectionChanged(): void
  }
  expand(): void
  close(): void
  ready(): void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем, доступен ли Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      
      // Инициализируем WebApp
      tg.ready()
      tg.expand()
      
      setWebApp(tg)
      setUser(tg.initDataUnsafe.user || null)
      
      // Устанавливаем тему
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
      
      console.log('Telegram WebApp initialized:', {
        user: tg.initDataUnsafe.user,
        platform: tg.platform,
        version: tg.version,
        colorScheme: tg.colorScheme
      })
    } else {
      // Режим разработки - создаем фиктивного пользователя
      console.log('Telegram WebApp not available, using demo mode')
      const demoUser: TelegramUser = {
        id: parseInt(localStorage.getItem('telegram_user_id') || Date.now().toString()),
        first_name: 'Demo',
        last_name: 'User',
        username: 'demo_user',
        language_code: 'ru'
      }
      setUser(demoUser)
    }
    
    setIsLoading(false)
  }, [])

  // Функция для получения реального telegram_id
  const getTelegramId = (): string => {
    if (user) {
      return user.id.toString()
    }

    // Fallback для режима разработки - только числовые ID
    const existingId = localStorage.getItem('telegram_user_id')

    // Проверяем, что ID числовой и валидный
    if (!existingId || existingId.includes('demo_user_') || existingId.includes('user_') || isNaN(Number(existingId))) {
      const newId = Date.now().toString()
      localStorage.setItem('telegram_user_id', newId)
      return newId
    }

    return existingId
  }

  // Функция для показа уведомления
  const showNotification = (type: 'error' | 'success' | 'warning') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred(type)
    }
  }

  // Функция для тактильной обратной связи
  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(style)
    }
  }

  // Функция для закрытия приложения
  const closeApp = () => {
    if (webApp) {
      webApp.close()
    }
  }

  return {
    webApp,
    user,
    isLoading,
    getTelegramId,
    showNotification,
    hapticFeedback,
    closeApp,
    isInTelegram: !!webApp
  }
}
