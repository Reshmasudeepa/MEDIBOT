"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import InstantLoadingLink from "@/components/InstantLoadingLink"

export default function TermsPage() {
  const primaryColor = "bg-[#e0f7fa]"
  const primaryText = "text-[#00796b]"
  const secondaryColor = "bg-[#e3f2fd]"
  const secondaryText = "text-[#1565c0]"

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
          <div className={`p-4 rounded-full ${secondaryColor}`}>
            <Shield className="h-8 w-8 text-[#1565c0]" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#263238] mb-4">
          Terms and <span className="bg-gradient-to-r from-[#00acc1] to-[#42a5f5] bg-clip-text text-transparent">Conditions</span>
        </h1>
        <p className="text-lg text-[#546e7a]">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible" className="w-full max-w-4xl mx-auto space-y-6">

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">1. Agreement & Access</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>
                By accessing or using the Platform (https://medibot-ai.com), you agree to be bound by these Terms of Use. If you transact on the Platform, you are subject to the policies applicable at that time.
              </p>
              <p className="mt-2">
                You must provide accurate information and will be responsible for any actions taken via your account.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">2. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a]">
              <p>
                The use of our services and platform is at your own risk. We are not liable for inaccuracies or performance failures. Unauthorized use may result in legal action.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">3. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#546e7a]">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4dd0e1] mt-0.5 mr-3 flex-shrink-0" />
                  <span>You are responsible for maintaining the accuracy of your medication information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4dd0e1] mt-0.5 mr-3 flex-shrink-0" />
                  <span>You must ensure your contact information is current to receive reminders</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4dd0e1] mt-0.5 mr-3 flex-shrink-0" />
                  <span>You agree not to misuse the Service or use it for any unlawful purpose</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#263238]">
                4. Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a] mb-4">
                Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
              </p>
              <InstantLoadingLink href="/privacy">
                <Button className={buttonClasses}>
                  View Privacy Policy
                </Button>
              </InstantLoadingLink>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#263238]">
                5. Service Modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a]">
                MediBot reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#263238]">
                6. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a]">
                In no event shall MediBot, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#263238]">7. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a]">
                These Terms shall be governed and construed in accordance with the laws of Delhi, India, without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Policy Section */}
        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#263238]">
                8. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#546e7a] mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
              </p>
              <p className="text-[#546e7a]">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="pt-6 text-center">
          <p className="text-[#546e7a] mb-6">
            For any queries related to these terms, please reach out via our Contact page.
          </p>
          <InstantLoadingLink href="/privacy">
            <Button className={`${buttonClasses} mr-4`}>View Privacy Policy</Button>
          </InstantLoadingLink>
          <InstantLoadingLink href="/">
            <Button className={buttonClasses}>Back to Home</Button>
          </InstantLoadingLink>
        </motion.div>
      </motion.div>
    </div>
  )
}
