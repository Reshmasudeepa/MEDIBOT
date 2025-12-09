"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Database, Shield, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import InstantLoadingLink from "@/components/InstantLoadingLink"

export default function PrivacyPage() {
  const primaryColor = "bg-[#e0f7fa]"
  const primaryText = "text-[#00796b]"

  const buttonClasses = `h-10 px-6 ${primaryColor} ${primaryText} border border-[#80deea] rounded-full text-base font-medium shadow-none hover:bg-[#b2ebf2] hover:border-[#4dd0e1] hover:text-[#00796b]`

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#e8f5e9] to-[#e3f2fd] text-[#263238] flex flex-col items-center justify-start pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${primaryColor}`}>
            <Lock className="h-8 w-8 text-[#00796b]" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#263238] mb-4">
          Privacy <span className="bg-gradient-to-r from-[#00acc1] to-[#42a5f5] bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-lg text-[#546e7a]">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible" className="w-full max-w-4xl mx-auto space-y-6">

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a]">
                This Privacy Policy describes how Asvix and its affiliates (“we”, “us”, “our”) collect, use, share, and protect your personal data through the platform https://medibot-ai.com (“Platform”). By using our services, you agree to the terms of this policy and the laws of India.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p className="mb-2"><Database className="inline mr-2 text-[#4dd0e1]" />We collect personal data such as name, contact details, date of birth, address, ID proofs, and biometric details with consent.</p>
              <p>We may also collect behavioral data, device information, and transaction records for service optimization.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#546e7a]">
                <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-3 text-[#4dd0e1]" /> Provide requested services</li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-3 text-[#4dd0e1]" /> Enhance customer experience</li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-3 text-[#4dd0e1]" /> Prevent fraud and enforce terms</li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 mr-3 text-[#4dd0e1]" /> Send offers and updates</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Sharing of Data</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>
                We may share your data with affiliates, business partners, and third parties to fulfill service obligations or as required by law. You may opt out of marketing communications.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p><Shield className="inline mr-2 text-[#4dd0e1]" />We adopt reasonable security measures and offer secure access to protect your personal data. However, data transmission over the internet may have inherent risks.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>You may access, correct, or delete your data via your profile. You may withdraw consent by writing to our Grievance Officer.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>We retain personal data only as long as necessary or legally required. Deleted accounts may result in loss of access to services.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Changes to the Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>We may update this policy. Users are advised to periodically review the policy for changes.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="pt-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-5 w-5 text-[#4dd0e1] mr-2" />
            <p className="text-[#546e7a]">Questions? Contact us at asvix2025@gmail.com</p>
          </div>
          <InstantLoadingLink href="/terms">
            <Button className={`${buttonClasses} mr-4`}>View Terms</Button>
          </InstantLoadingLink>
          <InstantLoadingLink href="/">
            <Button className={buttonClasses}>Back to Home</Button>
          </InstantLoadingLink>
        </motion.div>

      </motion.div>
    </div>
  )
}
