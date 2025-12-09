"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CompleteSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const url = window.location.href
        if (!isSignInWithEmailLink(auth, url)) {
          toast.error('Invalid or expired verification link')
          return
        }

        // Try to get data from sessionStorage first, then URL params
        const storedEmail = sessionStorage.getItem('signup_email') || searchParams?.get('email') || ''
        const storedName = sessionStorage.getItem('signup_name') || ''

        if (storedEmail) {
          // We have the email, proceed with passwordless signup
          await completeSignup(storedEmail, storedName, url)
        } else {
          // Missing email, ask user to provide it
          setEmail(storedEmail || '')
          setName(storedName)
          setNeedsPassword(true)
        }
      } catch (err: any) {
        console.error('complete-signup error', err)
        toast.error(err.message || 'Failed to complete signup')
      }
    }

    run()
  }, [router])

  const completeSignup = async (userEmail: string, userName: string, url: string) => {
    setProcessing(true)
    try {
      // Apply persistence according to stored preference
      try {
        const remember = sessionStorage.getItem('signup_remember') === 'true'
        const { browserLocalPersistence, browserSessionPersistence, setPersistence } = await import('firebase/auth')
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
      } catch (err) {
        console.warn('Failed to set persistence, falling back to default:', err)
      }

      // Sign in with the email link
      const result = await signInWithEmailLink(auth, userEmail, url)
      
      // Create Firestore user profile (only after verification)
      const userRef = doc(db, 'users', result.user.uid)
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        name: userName,
        createdAt: new Date().toISOString(),
      })

      // Clean up the ephemeral data
      sessionStorage.removeItem('signup_email')
      sessionStorage.removeItem('signup_password')
      sessionStorage.removeItem('signup_name')
  sessionStorage.removeItem('signup_remember')

  toast.success('Account created and verified. Redirecting...')
  router.push('/dashboard')
    } catch (err: any) {
      console.error('complete-signup error', err)
      toast.error(err.message || 'Failed to complete signup')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please provide your email')
      return
    }
    await completeSignup(email, name, window.location.href)
  }

  if (needsPassword) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: 'url(/loginbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-xl shadow-slate-950/50 p-6 sm:p-7 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Complete Your Signup</h1>
            <p className="text-slate-400 text-sm">Confirm your email to verify your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-1 text-sm">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you used to sign up"
                className="bg-slate-800/50 border-slate-700 text-white h-10 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-1 text-sm">Name (optional)</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-slate-800/50 border-slate-700 text-white h-10 rounded-lg focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <Button 
              type="submit" 
              disabled={processing}
              className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg font-medium transition-all duration-200"
            >
              {processing ? 'Verifying Account...' : 'Complete Signup'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/loginbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-xl shadow-slate-950/50 p-6 sm:p-7 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Completing signup...</h2>
          <p className="text-slate-400 text-sm">Verifying and creating your account — please wait.</p>
        </div>
      </div>
    </div>
  )
}
