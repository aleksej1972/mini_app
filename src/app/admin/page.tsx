'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Plus, Upload, BookOpen, FileText, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  level: string
  order: number
  description: string
}

interface Exercise {
  id: string
  lesson_id: string
  type: string
  order: number
  content_json: any
  xp_reward: number
  lessons?: {
    id: string
    title: string
    level: string
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'exercises'>('lessons')

  // Data state
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    level: 'A1',
    order: 1,
    description: ''
  })

  // Exercise form state
  const [exerciseForm, setExerciseForm] = useState({
    lessonId: '',
    type: 'quiz',
    order: 1,
    content: ''
  })

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Auto-calculate next order number for lessons
  useEffect(() => {
    if (lessons.length > 0) {
      const levelLessons = lessons.filter(l => l.level === lessonForm.level)
      const maxOrder = levelLessons.length > 0 ? Math.max(...levelLessons.map(l => l.order)) : 0
      setLessonForm(prev => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [lessonForm.level, lessons])

  // Auto-calculate next order number for exercises
  useEffect(() => {
    if (exercises.length > 0 && exerciseForm.lessonId) {
      const lessonExercises = exercises.filter(e => e.lesson_id === exerciseForm.lessonId)
      const maxOrder = lessonExercises.length > 0 ? Math.max(...lessonExercises.map(e => e.order)) : 0
      setExerciseForm(prev => ({ ...prev, order: maxOrder + 1 }))
    }
  }, [exerciseForm.lessonId, exercises])

  // JSON templates for different exercise types
  const getExerciseTemplate = (type: string) => {
    const templates = {
      'quiz': {
        question: "What is...?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A"
      },
      'fill-in-the-blank': {
        sentence: "I ___ happy.",
        options: ["am", "is", "are", "be"],
        correct: "am"
      },
      'memory-match': {
        word_pairs: [
          { english: "Hello", russian: "Привет" },
          { english: "Thank you", russian: "Спасибо" },
          { english: "Goodbye", russian: "До свидания" },
          { english: "Please", russian: "Пожалуйста" },
          { english: "Yes", russian: "Да" },
          { english: "No", russian: "Нет" }
        ]
      },
      'sentence-builder': {
        translation: "Меня зовут Анна.",
        correct_order: ["My", "name", "is", "Anna"],
        extra_words: ["am", "called", "the"]
      },
      'word-puzzle': {
        target: "Hello",
        words: ["Hello", "Hi", "Hey", "Goodbye"]
      },
      'reading': {
        text: "John is a student. He studies English every day. He likes reading books.",
        questions: [
          {
            question: "What does John study?",
            options: ["Math", "English", "History", "Science"],
            correct: "English"
          }
        ]
      },
      'audio-quiz': {
        audio_url: "https://example.com/audio.mp3",
        question: "What did you hear?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A"
      }
    }

    return templates[type as keyof typeof templates] || templates.quiz
  }

  // Update content when exercise type changes
  useEffect(() => {
    const template = getExerciseTemplate(exerciseForm.type)
    setExerciseForm(prev => ({
      ...prev,
      content: JSON.stringify(template, null, 2)
    }))
  }, [exerciseForm.type])

  // Get description for exercise type
  const getExerciseDescription = (type: string) => {
    const descriptions = {
      'quiz': 'Multiple choice question with 4 options',
      'fill-in-the-blank': 'Complete sentence with correct word',
      'memory-match': 'Match English words with Russian translations',
      'sentence-builder': 'Arrange words to build correct sentence',
      'word-puzzle': 'Find the correct word from options',
      'reading': 'Read text and answer comprehension questions',
      'audio-quiz': 'Listen to audio and answer questions'
    }

    return descriptions[type as keyof typeof descriptions] || 'Exercise description'
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [lessonsResponse, exercisesResponse] = await Promise.all([
        fetch('/api/lessons'),
        fetch('/api/exercises')
      ])

      if (lessonsResponse.ok) {
        const lessonsData = await lessonsResponse.json()
        setLessons(lessonsData.lessons || [])
      }

      if (exercisesResponse.ok) {
        const exercisesData = await exercisesResponse.json()
        setExercises(exercisesData.exercises || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage('❌ Error loading data')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle lesson form submission
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonForm),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Lesson created successfully!')
        setLessonForm({ title: '', level: 'A1', order: 1, description: '' })
        // Reload lessons to update the dropdown
        await loadData()
      } else {
        setMessage(`❌ ${data.error || 'Error creating lesson'}`)
      }
    } catch (error) {
      setMessage('❌ Error creating lesson. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle exercise form submission
  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validate JSON content
      JSON.parse(exerciseForm.content)

      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseForm),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Exercise created successfully!')
        setExerciseForm({ lessonId: '', type: 'quiz', order: 1, content: '' })
        // Reload exercises to update the list
        await loadData()
      } else {
        setMessage(`❌ ${data.error || 'Error creating exercise'}`)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setMessage('❌ Invalid JSON format. Please check your content.')
      } else {
        setMessage('❌ Error creating exercise. Please try again.')
      }
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage lessons and exercises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'lessons'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Lessons</span>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'exercises'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Exercises</span>
          </button>
        </div>

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Create New Lesson</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLessonSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter lesson title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={lessonForm.level}
                        onChange={(e) => setLessonForm({...lessonForm, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={lessonForm.order}
                        onChange={(e) => setLessonForm({...lessonForm, order: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={lessonForm.description}
                        onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter lesson description"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Adding...' : 'Add Lesson'}
                    </Button>

                    {message && (
                      <div className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Lessons */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Existing Lessons ({lessons.length})</h2>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No lessons created yet</p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">
                            Level: {lesson.level} | Order: {lesson.order}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {lesson.id.slice(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Bulk Upload</h2>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload JSON file with lessons</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop or click to select
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Create New Exercise</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExerciseSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson
                      </label>
                      <select
                        value={exerciseForm.lessonId}
                        onChange={(e) => setExerciseForm({...exerciseForm, lessonId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      >
                        <option value="">
                          {isLoading ? 'Loading lessons...' : 'Select a lesson'}
                        </option>
                        {lessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.level} - {lesson.title} (Order: {lesson.order})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exercise Type
                      </label>
                      <select
                        value={exerciseForm.type}
                        onChange={(e) => setExerciseForm({...exerciseForm, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="fill-in-the-blank">Fill in the Blank</option>
                        <option value="word-puzzle">Word Puzzle</option>
                        <option value="sentence-builder">Sentence Builder</option>
                        <option value="reading">Reading</option>
                        <option value="memory-match">Memory Match</option>
                        <option value="audio-quiz">Audio Quiz</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {getExerciseDescription(exerciseForm.type)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exerciseForm.order}
                        onChange={(e) => setExerciseForm({...exerciseForm, order: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exercise Content (JSON) - {exerciseForm.type.charAt(0).toUpperCase() + exerciseForm.type.slice(1).replace('-', ' ')}
                      </label>
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">
                          Template loaded automatically. Edit the values as needed:
                        </p>
                      </div>
                      <textarea
                        rows={12}
                        value={exerciseForm.content}
                        onChange={(e) => setExerciseForm({...exerciseForm, content: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                        placeholder="JSON template will be loaded automatically..."
                        required
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const template = getExerciseTemplate(exerciseForm.type)
                            setExerciseForm(prev => ({
                              ...prev,
                              content: JSON.stringify(template, null, 2)
                            }))
                          }}
                        >
                          Reset Template
                        </Button>
                        <span className="text-xs text-gray-500">
                          Click to restore original template
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Adding...' : 'Add Exercise'}
                    </Button>

                    {message && (
                      <div className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Exercises */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Existing Exercises ({exercises.length})</h2>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No exercises created yet</p>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {exercise.type}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              Order: {exercise.order}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Lesson: {exercise.lessons?.title || 'Unknown'} ({exercise.lessons?.level})
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            XP Reward: {exercise.xp_reward}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {exercise.id.slice(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Exercise Templates</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">Quiz Template</h3>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  "question": "What is...?",
  "options": ["A", "B", "C", "D"],
  "correct": "A"
}`}
                    </pre>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">Fill-in-the-Blank</h3>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  "sentence": "I ___ happy.",
  "options": ["am", "is", "are"],
  "correct": "am"
}`}
                    </pre>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">Memory Match</h3>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  "word_pairs": [
    {"english": "Hello", "russian": "Привет"},
    {"english": "Thank you", "russian": "Спасибо"},
    {"english": "Goodbye", "russian": "До свидания"}
  ]
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
