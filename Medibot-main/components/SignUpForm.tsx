"use client"

import React, { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, sendVerificationEmail } from "@/lib/firebase"
import { firebaseErrorMessage } from "@/lib/firebaseErrors"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user
      if (name) await updateProfile(user, { displayName: name })

      // Send verification
      await sendVerificationEmail(user)

      toast.success("Verification email sent. Please check your inbox.")
      router.push("/verify-email")
    } catch (err: any) {
      toast.error(firebaseErrorMessage(err.code, err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Your full name"
        />
      </div>
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
          placeholder="At least 6 characters"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  )
}
