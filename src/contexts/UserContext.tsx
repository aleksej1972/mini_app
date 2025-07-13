'use client'

import React, { createContext, useContext, useState } from 'react'

interface User {
  id: string
  telegram_id: string
  nickname: string
  avatar: string
  level: string
  theme: string
  is_onboarded: boolean
  total_xp: number
  current_streak: number
  last_activity_date: string
  created_at: string
  updated_at: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  isFirstTime: boolean
  checkUser: (telegramId: string) => Promise<void>
  createUser: (userData: {
    telegramId: string
    nickname: string
    avatar: string
    level: string
    theme?: string
  }) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  const checkUser = async (telegramId: string) => {
    console.log('🔍 Checking user with telegram_id:', telegramId)
    setIsLoading(true)
    
    try {
      // Валидация telegram_id
      if (!telegramId || telegramId === 'null' || telegramId === 'undefined') {
        console.log('❌ Invalid telegram_id, treating as new user')
        setUser(null)
        setIsFirstTime(true)
        return
      }

      const response = await fetch(`/api/users?telegram_id=${telegramId}`)
      const data = await response.json()
      
      if (response.ok && data.user) {
        console.log('✅ User found:', data.user.nickname)
        setUser(data.user)
        setIsFirstTime(false)
      } else {
        console.log('🆕 User not found, treating as new user')
        setUser(null)
        setIsFirstTime(true)
      }
    } catch (error) {
      console.error('💥 Error checking user:', error)
      setUser(null)
      setIsFirstTime(true)
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (userData: {
    telegramId: string
    nickname: string
    avatar: string
    level: string
    theme?: string
  }) => {
    console.log('🆕 Creating new user:', userData.nickname)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      
      if (response.ok && data.user) {
        console.log('✅ User created successfully:', data.user.nickname)
        setUser(data.user)
        setIsFirstTime(false)
      } else {
        console.error('❌ Failed to create user:', data.error)
        throw new Error(data.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('💥 Error creating user:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isFirstTime,
        checkUser,
        createUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
