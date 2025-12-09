'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react';

const plans = [
  {
    name: 'Base (Free)',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with AI health assistance',
    features: [
      '🤖 Open Source AI Models (Llama 3.3 70B, Mixtral 8x7B, Gemma 7B)',
      '🌍 Multilingual Support',
      '💬 Basic Health Chat',
      '📱 Mobile App Access',
      '🔒 Basic Security',
      '📧 Email Support'
    ],
    limitations: [
      '🚫 No Premium AI Models (GPT-4, Gemini Pro, Claude)',
      '🚫 No Prescription Analysis',
      '🚫 No Medication Reminders',
      '🚫 No Speech-to-Speech',
      '🚫 No Info Summarizer',
      '🚫 Limited Chat History'
    ],
    cta: 'Current Plan',
    highlight: false,
    popular: false,
  },
  {
    name: 'Premium (PRO)',
    price: '₹99',
    period: 'month',
    description: 'Complete health management with advanced AI and premium features',
    features: [
      '🚀 Everything in Base Plan',
      '🧠 Premium AI Models (GPT-4o, Gemini 2.0 Flash, Claude 3 Sonnet)',
      '📋 Advanced Prescription Analysis with OCR',
      '💊 Smart Medication Reminders & Scheduling',
      '🎤 Speech-to-Speech Interaction',
      '📝 Medical Info Summarizer',
      '📊 Advanced Health Dashboard',
      '📅 Appointment Management',
      '🔔 Multi-Channel Notifications (Push, Email, SMS)',
      '📈 Health Trends & Analytics',
      '💾 Unlimited Chat History',
      '🚨 Emergency Contact Features',
      '⚡ Priority Support',
      '🔒 Enhanced Security & Privacy'
    ],
    limitations: [],
    cta: 'Upgrade to PRO',
    highlight: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₹999',
    period: 'year',
    description: 'Advanced solution for healthcare organizations and teams',
    features: [
      '🏆 Everything in Premium',
      '👥 Team Collaboration & Management',
      '🏥 Healthcare Provider Integration',
      '📊 Advanced Analytics & Reporting',
      '🔗 Custom API Integrations',
      '🎯 Dedicated Account Manager',
      '📞 24/7 Phone Support',
      '🔐 Enterprise-grade Security',
      '⚙️ Custom Workflows',
      '📋 Compliance Tools (HIPAA ready)'
    ],
    limitations: [],
    cta: 'Contact Sales',
    highlight: false,
    popular: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);

  // Check for payment status in URL params
  useEffect(() => {
    if (!searchParams) return;
    
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    const message = searchParams.get('message');

    if (status === 'success') {
      setPaymentStatus('success');
      toast.success(`Payment successful! Transaction ID: ${transactionId}`);
    } else if (status === 'failed') {
      setPaymentStatus('failed');
      toast.error(`Payment failed: ${message || 'Unknown error'}`);
    }
  }, [searchParams]);

  const handlePhonePePayment = async (planName: string, amount: number) => {
    if (!user) {
      toast.error('Please login to upgrade your plan');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/phonepe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          userId: user.uid,
          planName: planName,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.redirectUrl) {
        // Store transaction ID in localStorage for potential status checking
        if (result.data.merchantTransactionId) {
          localStorage.setItem('pendingPayment', JSON.stringify({
            transactionId: result.data.merchantTransactionId,
            planName: planName,
            amount: amount,
            timestamp: Date.now()
          }));
        }
        
        // Redirect to PhonePe payment page
        window.location.href = result.data.redirectUrl;
      } else {
        console.error('Payment initiation failed:', result);
        toast.error(result.message || 'Failed to initiate payment. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4">
      {/* Payment Status Banner */}
      {paymentStatus === 'success' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">Payment Successful!</p>
              <p className="text-green-600 dark:text-green-400 text-sm">Your Premium plan has been activated.</p>
            </div>
          </div>
        </div>
      )}
      
      {paymentStatus === 'failed' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Payment Failed</p>
              <p className="text-red-600 dark:text-red-400 text-sm">Please try again or contact support if the issue persists.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-300">Choose Your MediBot Plan</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Get the healthcare assistance you need with transparent pricing and clear feature comparison.</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
          <strong>New:</strong> Compare features side-by-side to see exactly what's included in each plan. From basic AI models to advanced prescription analysis.
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'flex-1 bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-8 flex flex-col border-2 transition-all duration-300 max-w-md mx-auto lg:mx-0 relative',
              plan.highlight ? 'border-blue-500 scale-105 z-10 shadow-blue-200 dark:shadow-blue-900/20' : 'border-gray-200 dark:border-gray-800'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{plan.name}</h2>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-200">{plan.price}</span>
                {plan.period && <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
            </div>

            <div className="flex-grow">
              <div className="mb-6">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  What's Included
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Not Included
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-4">
              {plan.cta === 'Current Plan' ? (
                <button className="w-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg cursor-default flex items-center justify-center gap-2" disabled>
                  <CheckCircle className="h-4 w-4" />
                  {plan.cta}
                </button>
              ) : plan.cta === 'Upgrade to PRO' ? (
                <button 
                  onClick={() => handlePhonePePayment('Premium', 99)}
                  disabled={loading === 'Premium'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading === 'Premium' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      {plan.cta}
                    </>
                  )}
                </button>
              ) : plan.cta === 'Contact Sales' ? (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handlePhonePePayment('Enterprise', 799)}
                    disabled={loading === 'Enterprise'}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading === 'Enterprise' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                  <Link 
                    href="/contact" 
                    className="text-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    or Contact Sales
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      
      <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>* All prices are inclusive of taxes. Cancel anytime. For teams and custom solutions, contact sales.</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <CreditCard className="h-4 w-4" />
          <span>Secure payments powered by PhonePe</span>
        </div>
      </div>
    </div>
  );
}
