"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthGuard } from "@/components/auth-guard"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { sendSignInLinkToEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeToTerms: false,
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, signInWithFacebook } = useAuth()
  const router = useRouter()

  const actionCodeSettings = {
    url: (typeof window !== 'undefined' ? `${window.location.origin}/auth/complete-signup?email=${encodeURIComponent(formData.email)}` : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/complete-signup`),
    handleCodeInApp: true,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    if (!formData.email) {
      toast.error('Please provide your email')
      return
    }

    setLoading(true)
    try {
      // send email sign-in link; account will be created when the user clicks the link
      await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings)
      // store ephemeral signup data to complete signup after verification
      sessionStorage.setItem('signup_email', formData.email)
      sessionStorage.setItem('signup_name', formData.name || '')
  // store remember preference so completion can apply persistence
  sessionStorage.setItem('signup_remember', formData.rememberMe ? 'true' : 'false')

      toast.success('Verification link sent. Check your inbox to complete signup.')
      router.push('/verify-email')
    } catch (error: any) {
      console.error('sendSignInLinkToEmail error', error)
      toast.error(error.message || 'Failed to send verification link')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Account created with Google successfully!")
      router.push("/profile-setup")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignUp = async () => {
    setLoading(true)
    try {
      await signInWithFacebook()
      toast.success("Account created with Facebook successfully!")
      router.push("/profile-setup")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Facebook")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
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
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                <p>Back</p>
              </Button>
            </Link>
            
          </div>

          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 relative">
                <Image 
                  src="/logo.png" 
                  alt="Medibot Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-full border-2 border-slate-700/50"
                />
              </div>
              <span className="text-white font-bold text-xl">Medibot</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-slate-400 text-sm">Join thousands improving their health with AI</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-white font-medium mb-1 text-sm">Full Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white h-10 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1 text-sm">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white h-10 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="accent-purple-600 h-4 w-4 rounded border-gray-400 focus:ring-purple-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-slate-300 text-sm select-none cursor-pointer">Remember Me</label>
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 py-1">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                className="mt-1 border-2 border-purple-500 rounded text-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-700 focus-visible:ring-2 focus-visible:ring-purple-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg font-medium transition-all duration-200"
            >
              {loading ? "Sending Verification..." : "Send Verification Link"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-900/90 text-slate-400">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                variant="outline"
                className="h-9 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 rounded-lg transition-all text-sm"
              >
                <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                onClick={handleFacebookSignUp}
                disabled={loading}
                variant="outline"
                className="h-9 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 rounded-lg transition-all text-sm"
              >
                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center pt-1">
              <span className="text-slate-400 text-sm">Already have an account? </span>
              <Link href="/auth/signin" className="text-green-400 hover:underline text-sm font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}