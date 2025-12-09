"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { applyActionCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from "sonner"
import Link from 'next/link'

export default function VerifyEmailActionPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = searchParams?.get('oobCode')
      const mode = searchParams?.get('mode')
      
      if (!actionCode || mode !== 'verifyEmail') {
        setStatus('invalid')
        setErrorMessage('Invalid verification link')
        return
      }
      
      try {
        // Apply the email verification code
        await applyActionCode(auth, actionCode)
        setStatus('success')
        toast.success("Email verified successfully!")
        
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?verified=true')
        }, 3000)
        
      } catch (error: any) {
        console.error('Email verification error:', error)
        setStatus('error')
        
        if (error.code === 'auth/expired-action-code') {
          setErrorMessage('This verification link has expired. Please request a new one.')
        } else if (error.code === 'auth/invalid-action-code') {
          setErrorMessage('This verification link is invalid or has already been used.')
        } else {
          setErrorMessage('Failed to verify email. Please try again.')
        }
      }
    }
    
    verifyEmail()
  }, [searchParams, router])
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Verifying Email...</CardTitle>
            <CardDescription>
              Please wait while we verify your email address.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
  
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now sign in to your account.
              Redirecting to sign in page...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signin">
              <Button className="mt-4">
                Continue to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Error or invalid status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Verification Failed</CardTitle>
          <CardDescription>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <Link href="/auth/signup">
              <Button variant="default" className="w-full">
                Create New Account
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
