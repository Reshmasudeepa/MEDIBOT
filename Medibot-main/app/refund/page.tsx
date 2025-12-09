"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import InstantLoadingLink from "@/components/InstantLoadingLink"

export default function RefundPolicyPage() {
  const primaryColor = "bg-[#e0f7fa]"
  const primaryText = "text-[#00796b]"
  const secondaryColor = "bg-[#e3f2fd]"

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
            <CheckCircle className="h-8 w-8 text-[#00796b]" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#263238] mb-4">
          Refund & <span className="bg-gradient-to-r from-[#00acc1] to-[#42a5f5] bg-clip-text text-transparent">Cancellation Policy</span>
        </h1>
        <p className="text-lg text-[#546e7a]">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible" className="w-full max-w-4xl mx-auto space-y-6">

        <motion.div variants={item}>
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Refund & Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-[#546e7a] space-y-3">
              <p>
                At MediBot, we strive to ensure customer satisfaction with every purchase. If you are not entirely satisfied with your order, we are here to assist you with our refund and cancellation process.
              </p>
              <ul className="space-y-2">
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />Cancellations must be requested within 1 day of placing the order to be eligible for a full refund.</li>
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />Damaged or defective items must be reported within 1 day of delivery to qualify for a replacement or refund.</li>
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />If refund is approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 7-10 business days.</li>
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />Complaints for items with a manufacturer's warranty should be directed to the respective manufacturer for resolution.</li>
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />To initiate a refund or cancellation, please contact our customer support team with your order details, including the order number and reason for the request.</li>
                <li><CheckCircle className="inline mr-2 text-[#4dd0e1]" />Refunds will not be processed for items that have been used, damaged by the customer, or are not in their original condition upon return.</li>
              </ul>
              <p>
                Please note that processing times may vary depending on your bank or payment provider. For any additional assistance, our customer support team is available to guide you through the process. We value your trust and aim to make your experience with us as seamless as possible.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="pt-6 text-center">
          <p className="text-[#546e7a] mb-6">
            For refund-related concerns, please contact our customer support.
          </p>
          <InstantLoadingLink href="/">
            <Button className={buttonClasses}>Back to Home</Button>
          </InstantLoadingLink>
        </motion.div>

        <motion.div variants={item} className="pt-6 text-center">
          <p className="text-[#546e7a] text-sm">
            Managed by A G Vignesh Skanda
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}