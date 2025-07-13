'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { createUser, getUserByTelegramId, getAllLessons, getExercisesByLessonId } from '@/lib/database'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function TestPage() {
  const [results, setResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({})
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const setResult = (test: string, result: 'pending' | 'success' | 'error') => {
    setResults(prev => ({ ...prev, [test]: result }))
  }

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    setResult(testName, 'pending')
    addLog(`Starting ${testName}...`)
    try {
      await testFn()
      setResult(testName, 'success')
      addLog(`✅ ${testName} passed`)
    } catch (error) {
      setResult(testName, 'error')
      addLog(`❌ ${testName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testUserCreation = async () => {
    const testUser = {
      telegram_id: 987654321,
      username: 'testuser2',
      first_name: 'Test',
      last_name: 'User2',
      level: 'A1' as const,
      xp: 0
    }

    // Try to create user
    const user = await createUser(testUser)
    if (!user) throw new Error('Failed to create user')
    
    addLog(`User created with ID: ${user.id}`)
    
    // Try to fetch user
    const fetchedUser = await getUserByTelegramId(testUser.telegram_id)
    if (!fetchedUser) throw new Error('Failed to fetch created user')
    
    addLog(`User fetched successfully: ${fetchedUser.first_name}`)
  }

  const testLessonsLoading = async () => {
    const lessons = await getAllLessons()
    if (lessons.length === 0) throw new Error('No lessons found')
    
    addLog(`Found ${lessons.length} lessons`)
    addLog(`First lesson: ${lessons[0].title}`)
  }

  const testExercisesLoading = async () => {
    const lessons = await getAllLessons()
    if (lessons.length === 0) throw new Error('No lessons found')
    
    const exercises = await getExercisesByLessonId(lessons[0].id)
    if (exercises.length === 0) throw new Error('No exercises found')
    
    addLog(`Found ${exercises.length} exercises for lesson: ${lessons[0].title}`)
    addLog(`First exercise type: ${exercises[0].type}`)
  }

  const runAllTests = async () => {
    setLogs([])
    setResults({})
    
    await runTest('User Creation', testUserCreation)
    await runTest('Lessons Loading', testLessonsLoading)
    await runTest('Exercises Loading', testExercisesLoading)
    
    addLog('All tests completed!')
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const tests = [
    { name: 'User Creation', key: 'User Creation' },
    { name: 'Lessons Loading', key: 'Lessons Loading' },
    { name: 'Exercises Loading', key: 'Exercises Loading' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">App Testing</h1>
          <p className="text-gray-600">Test all core functionality</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Controls</h2>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} className="w-full">
              Run All Tests
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Results</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.map((test) => (
                <div key={test.key} className="flex items-center space-x-3">
                  {getStatusIcon(results[test.key])}
                  <span className="font-medium">{test.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Logs</h2>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-400">No logs yet. Run tests to see output.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Quick Links</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Home
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/lessons?level=A1'}>
                A1 Lessons
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/setup'}>
                Setup
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                Admin
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
