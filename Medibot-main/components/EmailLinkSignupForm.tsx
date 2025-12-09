"use client"

import React, { useState } from "react"
import { sendSignInLinkToEmail, isSignInWithEmailLink } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { toast } from "sonner"

export default function EmailLinkSignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) must be in the authorized domains list in the Firebase Console.
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/complete-signup`,
    handleCodeInApp: true,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please provide email and password")
      return
    }
    setLoading(true)
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      // Save name/password temporarily in sessionStorage for completion step
      sessionStorage.setItem('signup_email', email)
      // Store password only in sessionStorage (ephemeral) - warn: sensitive
      sessionStorage.setItem('signup_password', password)
      sessionStorage.setItem('signup_name', name || '')

      toast.success("Verification link sent to your email. Please check your inbox.")
    } catch (err: any) {
      console.error('sendSignInLinkToEmail error', err)
      toast.error(err.message || 'Failed to send verification link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Full name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Your name" />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm">Password (will be set after verification)</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Choose a secure password" />
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
          {loading ? 'Sending verification...' : 'Create account (verify email)'}
        </button>
      </div>
    </form>
  )
}
