// For now, we'll use the global Telegram WebApp object
// import { initData, miniApp } from '@telegram-apps/sdk'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export interface TelegramInitData {
  user?: TelegramUser
  auth_date: number
  hash: string
}

// Initialize Telegram WebApp
export function initTelegramWebApp() {
  if (typeof window !== 'undefined') {
    try {
      const webApp = window.Telegram?.WebApp
      if (webApp) {
        webApp.ready()
        webApp.expand()
        webApp.enableClosingConfirmation()

        // Set theme colors
        webApp.setHeaderColor('#1f2937') // gray-800
        webApp.setBackgroundColor('#f9fafb') // gray-50

        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initialize Telegram WebApp:', error)
      return false
    }
  }
  return false
}

// Get Telegram user data
export function getTelegramUser(): TelegramUser | null {
  if (typeof window === 'undefined') return null

  try {
    // Check if we're in Telegram environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      console.warn('Using Telegram WebApp data')
      return window.Telegram.WebApp.initDataUnsafe.user
    }

    // For development, return a mock user
    console.warn('Using mock user for development')
    return {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser'
    }
  } catch (error) {
    console.error('Failed to get Telegram user data:', error)
    // Return mock user as fallback
    return {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser'
    }
  }
}

// Validate Telegram WebApp data (server-side)
export function validateTelegramData(initData: string, botToken: string): boolean {
  if (!initData || !botToken) return false
  
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')
    
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
    
    const crypto = require('crypto')
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
    
    return calculatedHash === hash
  } catch (error) {
    console.error('Error validating Telegram data:', error)
    return false
  }
}

// Check if running in Telegram WebApp environment
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false
  
  return !!(
    window.Telegram?.WebApp ||
    window.location.search.includes('tgWebAppData') ||
    window.location.hash.includes('tgWebAppData')
  )
}

// Get Telegram WebApp instance
export function getTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return null
}

// Show Telegram alert
export function showTelegramAlert(message: string) {
  try {
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  } catch (error) {
    alert(message)
  }
}

// Show Telegram confirm dialog
export function showTelegramConfirm(message: string, callback: (confirmed: boolean) => void) {
  try {
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.showConfirm(message, callback)
    } else {
      const confirmed = confirm(message)
      callback(confirmed)
    }
  } catch (error) {
    const confirmed = confirm(message)
    callback(confirmed)
  }
}

// Haptic feedback
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
  try {
    // Use the miniApp haptic feedback if available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      const haptic = window.Telegram.WebApp.HapticFeedback
      switch (type) {
        case 'light':
          haptic.impactOccurred('light')
          break
        case 'medium':
          haptic.impactOccurred('medium')
          break
        case 'heavy':
          haptic.impactOccurred('heavy')
          break
        case 'rigid':
          haptic.impactOccurred('rigid')
          break
        case 'soft':
          haptic.impactOccurred('soft')
          break
      }
    }
  } catch (error) {
    // Silently fail if haptic feedback is not available
    console.debug('Haptic feedback not available:', error)
  }
}

// Close Telegram WebApp
export function closeTelegramWebApp() {
  try {
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.close()
    }
  } catch (error) {
    console.error('Failed to close Telegram WebApp:', error)
  }
}
