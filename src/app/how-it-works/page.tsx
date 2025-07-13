'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Smartphone, 
  User, 
  Database, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">How Telegram Registration Works</h1>
          <p className="text-gray-600">Seamless authentication without passwords</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Overview */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Zero-Click Registration
                </h2>
                <p className="text-blue-800">
                  Telegram Mini Apps automatically provide user information, eliminating the need for 
                  traditional registration forms, passwords, or email verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Process */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
          
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <h3 className="text-lg font-semibold">User Opens Mini App</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Smartphone className="h-8 w-8 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    When a user taps on your Mini App in Telegram, the app launches within 
                    the Telegram interface.
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                    window.Telegram.WebApp.initDataUnsafe.user
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h3 className="text-lg font-semibold">Telegram Provides User Data</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <User className="h-8 w-8 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-700 mb-3">
                    Telegram automatically provides user information including:
                  </p>
                  <ul className="space-y-1 text-gray-600 mb-3">
                    <li>• Telegram ID (unique identifier)</li>
                    <li>• First name and last name</li>
                    <li>• Username (if set)</li>
                    <li>• Language preference</li>
                    <li>• Premium status</li>
                  </ul>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm">
                    <pre>{`{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "language_code": "en"
}`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <h3 className="text-lg font-semibold">App Creates User Profile</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Database className="h-8 w-8 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Our app automatically creates a user profile in the database using 
                    the Telegram data.
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                    createUser(telegramUserData) → Database Record
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">User is Ready to Learn</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Zap className="h-8 w-8 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-700">
                    The user is immediately logged in and can start using the app. 
                    No forms, no passwords, no email verification required!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-green-900">Security & Privacy</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-green-800">
              <p>
                <strong>Secure:</strong> Telegram handles all authentication and provides 
                cryptographically signed user data.
              </p>
              <p>
                <strong>Private:</strong> Users control what information they share through 
                their Telegram privacy settings.
              </p>
              <p>
                <strong>Trusted:</strong> No need to store passwords or handle sensitive 
                authentication data in your app.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Benefits for Users</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>No registration forms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>No passwords to remember</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>No email verification</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Secure authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Privacy controlled by Telegram</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Try It Out */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">Experience It Yourself</h2>
            <p className="mb-4 opacity-90">
              See how seamless Telegram registration works in our English learning app
            </p>
            <div className="space-y-3">
              <Link href="/register">
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Try Registration Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <div className="text-sm opacity-75">
                No actual registration required - just a demonstration
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/register">
            <Button>Try Registration</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
