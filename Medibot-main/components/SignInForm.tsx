"use client"

import React, { useState } from "react"
import { signInWithEmailAndPassword, sendEmailVerification as sendVerif } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { firebaseErrorMessage } from "@/lib/firebaseErrors"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const user = cred.user
      // reload to ensure fresh state
      await user.reload()
      if (!user.emailVerified) {
        // Resend verification before signing out to allow immediate resend
        try {
          await sendVerif(user)
          toast.success("Verification email resent. Please check your inbox.")
        } catch (resendErr: any) {
          toast.error(firebaseErrorMessage(resendErr.code, resendErr.message))
        }
        await auth.signOut()
        toast.error("Please verify your email before logging in.")
        return
      }

      toast.success("Signed in successfully")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(firebaseErrorMessage(err.code, err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Your password"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  )
}
