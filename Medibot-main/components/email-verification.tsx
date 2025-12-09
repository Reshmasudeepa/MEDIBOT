"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface EmailVerificationContextType {
  isVerificationPending: boolean
  resendVerificationEmail: () => Promise<void>
  checkVerificationStatus: () => Promise<boolean>
}

const EmailVerificationContext = createContext<EmailVerificationContextType | undefined>(undefined)

export function EmailVerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerificationPending, setIsVerificationPending] = useState(false)
  const { user, resendVerificationEmail, checkEmailVerified } = useAuth()

  useEffect(() => {
    if (user && !user.emailVerified) {
      setIsVerificationPending(true)
    } else {
      setIsVerificationPending(false)
    }
  }, [user])

  const handleResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail()
      toast.success("Verification email sent! Please check your inbox.")
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email")
    }
  }

  const handleCheckVerificationStatus = async () => {
    try {
      const isVerified = await checkEmailVerified()
      if (isVerified) {
        setIsVerificationPending(false)
        toast.success("Email verified successfully!")
      }
      return isVerified
    } catch (error: any) {
      toast.error("Failed to check verification status")
      return false
    }
  }

  return (
    <EmailVerificationContext.Provider 
      value={{
        isVerificationPending,
        resendVerificationEmail: handleResendVerificationEmail,
        checkVerificationStatus: handleCheckVerificationStatus,
      }}
    >
      {children}
    </EmailVerificationContext.Provider>
  )
}

export function useEmailVerification() {
  const context = useContext(EmailVerificationContext)
  if (context === undefined) {
    throw new Error('useEmailVerification must be used within an EmailVerificationProvider')
  }
  return context
}

// Email verification banner component
export function EmailVerificationBanner() {
  const { user } = useAuth()
  const { resendVerificationEmail } = useEmailVerification()
  const [isResending, setIsResending] = useState(false)
  
  if (!user || user.emailVerified) {
    return null
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendVerificationEmail()
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Email verification required:</strong> Please check your email and click the verification link to access all features.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 underline disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend email'}
          </button>
        </div>
      </div>
    </div>
  )
}
