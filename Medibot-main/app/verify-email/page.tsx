"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending')
  const [countdown, setCountdown] = useState(0)
  
  const { user, resendVerificationEmail, checkEmailVerified, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Auto-check verification status
  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const isVerified = await checkEmailVerified()
        if (isVerified) {
          setVerificationStatus('verified')
          toast.success("Email verified successfully!")
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      }
    }
    
    checkStatus()
    
    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [user, checkEmailVerified, router])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (countdown > 0) return
    
    setIsResending(true)
    try {
      await resendVerificationEmail()
      toast.success("Verification email sent! Please check your inbox.")
      setCountdown(60) // 60 second cooldown
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  const handleManualCheck = async () => {
    setIsVerifying(true)
    try {
      const isVerified = await checkEmailVerified()
      if (isVerified) {
        setVerificationStatus('verified')
        toast.success("Email verified successfully!")
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        toast.info("Email not verified yet. Please check your inbox and click the verification link.")
      }
    } catch (error: any) {
      toast.error("Failed to check verification status")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/auth/signin')
  }

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification email to <strong>{user?.email}</strong>. 
            Please check your inbox and click the verification link.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Check your email</p>
                <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Click the verification link in the email</li>
                  <li>• Check your spam/junk folder if you don&apos;t see it</li>
                  <li>• The link will expire in 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleManualCheck} 
              disabled={isVerifying}
              className="w-full"
              variant="default"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "I've verified my email"
              )}
            </Button>

            <Button 
              onClick={handleResendEmail} 
              disabled={isResending || countdown > 0}
              className="w-full"
              variant="outline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend verification email"
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-600 dark:text-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Sign out
            </Button>
            
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
