"use client";

import { ArrowLeft, Cookie, FileText, Shield, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <Link href="/">
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0 border-2 border-[#0E7490]/30 hover:bg-[#0E7490]/10 hover:border-[#0E7490]/50 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 text-[#0E7490]" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0E7490] via-[#0891B2] to-[#06B6D4] rounded-2xl flex items-center justify-center shadow-xl">
                <Cookie className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0E7490] to-[#0891B2] bg-clip-text text-transparent mb-2">
                  Cookie Policy
                </h1>
                <p className="text-gray-600 text-xl font-medium">
                  Transparency in how MediBot protects and uses your data
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4] rounded-full max-w-2xl" />
            
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-white rounded-xl border border-[#0E7490]/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">GDPR Compliant</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0E7490]/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-gray-900">4</p>
                    <p className="text-sm text-gray-600">Cookie Categories</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0E7490]/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-gray-900">Full</p>
                    <p className="text-sm text-gray-600">User Control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5">
                <CardTitle className="text-lg text-[#0E7490] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <a href="#overview" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Overview
                </a>
                <a href="#what-are-cookies" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  What are cookies?
                </a>
                <a href="#types-of-cookies" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Types of cookies we use
                </a>
                <a href="#cookie-purposes" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Cookie purposes
                </a>
                <a href="#detailed-cookies" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Detailed cookie list
                </a>
                <a href="#managing-cookies" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Managing your cookies
                </a>
                <a href="#contact" className="text-sm text-[#0E7490] hover:text-[#0C6A83] hover:underline transition-all duration-200 flex items-center gap-2 p-2 rounded-lg hover:bg-[#0E7490]/5">
                  <div className="w-1.5 h-1.5 bg-[#0E7490] rounded-full" />
                  Contact us
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <Card id="overview" className="border-[#0E7490]/20 shadow-lg bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4]" />
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy-First Healthcare</h2>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        At MediBot, we prioritize your privacy while delivering exceptional healthcare management. 
                        This comprehensive policy explains exactly how cookies enhance your experience while keeping your medical data secure.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        What We Promise
                      </h3>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Transparent cookie usage</li>
                        <li>• Complete user control</li>
                        <li>• HIPAA & GDPR compliance</li>
                        <li>• No selling of health data</li>
                        <li>• Secure encryption always</li>
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Cookie className="w-5 h-5" />
                        Your Rights
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li>• Accept or decline cookies</li>
                        <li>• Customize preferences anytime</li>
                        <li>• Request data deletion</li>
                        <li>• Export your information</li>
                        <li>• Withdraw consent easily</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-[#0E7490]/5 via-[#0891B2]/5 to-[#06B6D4]/5 rounded-xl border-l-4 border-[#0E7490] mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-5 h-5 bg-[#0E7490] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-[#0E7490] mb-0">
                        Last updated: September 18, 2025
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                      This policy applies to all MediBot services, mobile apps, and web platforms. 
                      We notify users of any significant changes via email and in-app notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Introduction */}
            <Card className="border-[#0E7490]/20 shadow-lg bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4]" />
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Privacy Matters</h2>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        At MediBot, we use cookies and similar technologies to provide you with a better, 
                        faster, and safer healthcare management experience. This cookie policy explains what cookies are, how we use them, 
                        and how you can control them.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-[#0E7490]/5 via-[#0891B2]/5 to-[#06B6D4]/5 rounded-xl border-l-4 border-[#0E7490]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-5 h-5 bg-[#0E7490] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-[#0E7490] mb-0">
                        Last updated: September 18, 2025
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                      This policy applies to all MediBot services and applications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What are cookies */}
            <Card id="what-are-cookies" className="border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-white" />
                  </div>
                  What are cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Cookies are small text files that are stored on your device when you visit a website. 
                  They help websites remember information about your visit, such as your preferred language 
                  and other settings, which can make your next visit easier and the site more useful to you.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-[#0E7490]/5 rounded-lg border border-[#0E7490]/20">
                    <h4 className="font-semibold text-[#0E7490] mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Secure Storage
                    </h4>
                    <p className="text-sm text-gray-600">Cookies are encrypted and stored securely on your device</p>
                  </div>
                  <div className="p-4 bg-[#0891B2]/5 rounded-lg border border-[#0891B2]/20">
                    <h4 className="font-semibold text-[#0891B2] mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      User Control
                    </h4>
                    <p className="text-sm text-gray-600">You have full control over which cookies to accept</p>
                  </div>
                  <div className="p-4 bg-[#06B6D4]/5 rounded-lg border border-[#06B6D4]/20">
                    <h4 className="font-semibold text-[#06B6D4] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Transparency
                    </h4>
                    <p className="text-sm text-gray-600">Clear information about every cookie we use</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types of cookies */}
            <Card id="types-of-cookies" className="border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Types of cookies we use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 font-semibold">
                        Essential
                      </Badge>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      🔒 Essential Cookies
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Required for basic website functionality, security, user authentication, and core MediBot features. 
                      These cannot be disabled as they're essential for your safety.
                    </p>
                  </div>

                  <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 font-semibold">
                        Analytics
                      </Badge>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      📊 Performance Cookies
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Help us understand how visitors interact with MediBot by collecting 
                      and reporting information anonymously to improve our healthcare services.
                    </p>
                  </div>

                  <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1 font-semibold">
                        Functional
                      </Badge>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      ⚙️ Functionality Cookies
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Enable enhanced features and personalization, such as remembering your 
                      medication preferences, notification settings, and dashboard customizations.
                    </p>
                  </div>

                  <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 font-semibold">
                        Marketing
                      </Badge>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                      🎯 Targeting Cookies
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Used to deliver more relevant health tips and measure the effectiveness 
                      of educational content and wellness recommendations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookie purposes */}
            <Card id="cookie-purposes" className="border-[#0E7490]/20 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  How we use cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6">
                  <div className="p-6 border-l-4 border-[#0E7490] bg-gradient-to-r from-[#0E7490]/5 to-transparent rounded-r-lg shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      🔐 Authentication & Security
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Keep you securely logged in, protect against unauthorized access to your health data, 
                      and ensure your medication information remains private and secure across sessions.
                    </p>
                  </div>
                  
                  <div className="p-6 border-l-4 border-[#0891B2] bg-gradient-to-r from-[#0891B2]/5 to-transparent rounded-r-lg shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0891B2] to-[#06B6D4] rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      ⚙️ Preferences & Settings
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Remember your medication schedules, notification preferences, dashboard layout, 
                      theme choices, and app customizations for a personalized healthcare experience.
                    </p>
                  </div>
                  
                  <div className="p-6 border-l-4 border-[#06B6D4] bg-gradient-to-r from-[#06B6D4]/5 to-transparent rounded-r-lg shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      📊 Analytics & Improvement
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Understand how our app is used to improve features, fix issues, and enhance the overall 
                      healthcare management experience (all data is anonymized and aggregated).
                    </p>
                  </div>
                  
                  <div className="p-6 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-r-lg shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      🔔 Notifications & Reminders
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Enable medication reminders, appointment notifications, and important health alerts 
                      to help you stay on track with your wellness goals and treatment plans.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Cookie List */}
            <Card id="detailed-cookies" className="border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Detailed Cookie Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Here's a comprehensive list of all cookies used by MediBot, including their purpose, duration, and data collected.
                </p>
                
                <div className="space-y-6">
                  {/* Essential Cookies Table */}
                  <div className="border border-green-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-200">
                      <h3 className="font-bold text-green-800 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        Essential Cookies
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-900">Cookie Name</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Purpose</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">medibot_session</td>
                            <td className="p-4 text-sm">Maintains your login session and security</td>
                            <td className="p-4 text-sm">Session only</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">csrf_token</td>
                            <td className="p-4 text-sm">Protects against security attacks</td>
                            <td className="p-4 text-sm">Session only</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">auth_state</td>
                            <td className="p-4 text-sm">Remembers authentication status</td>
                            <td className="p-4 text-sm">7 days</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">medibot_preferences</td>
                            <td className="p-4 text-sm">Stores basic app preferences</td>
                            <td className="p-4 text-sm">30 days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analytics Cookies Table */}
                  <div className="border border-blue-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-blue-200">
                      <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        Analytics Cookies (Optional)
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-900">Cookie Name</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Purpose</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">_ga</td>
                            <td className="p-4 text-sm">Google Analytics - distinguishes users</td>
                            <td className="p-4 text-sm">2 years</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">_ga_ID</td>
                            <td className="p-4 text-sm">Google Analytics - session state</td>
                            <td className="p-4 text-sm">2 years</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">medibot_analytics</td>
                            <td className="p-4 text-sm">Internal usage analytics (anonymized)</td>
                            <td className="p-4 text-sm">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Functional Cookies Table */}
                  <div className="border border-purple-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 border-b border-purple-200">
                      <h3 className="font-bold text-purple-800 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        Functional Cookies (Optional)
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-900">Cookie Name</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Purpose</th>
                            <th className="text-left p-4 font-semibold text-gray-900">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">theme_preference</td>
                            <td className="p-4 text-sm">Remembers dark/light mode choice</td>
                            <td className="p-4 text-sm">1 year</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">dashboard_layout</td>
                            <td className="p-4 text-sm">Saves dashboard customizations</td>
                            <td className="p-4 text-sm">6 months</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-mono text-sm bg-gray-50">notification_settings</td>
                            <td className="p-4 text-sm">Stores notification preferences</td>
                            <td className="p-4 text-sm">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Protection Notice
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li>• All cookies containing personal data are encrypted</li>
                    <li>• No health information is stored in cookies</li>
                    <li>• Cookies are only accessible by MediBot servers</li>
                    <li>• We never sell or share cookie data with third parties</li>
                    <li>• You can delete all cookies anytime through your browser</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Managing cookies */}
            <Card id="managing-cookies" className="border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Managing your cookie preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="p-6 bg-gradient-to-r from-[#0E7490]/5 via-[#0891B2]/5 to-[#06B6D4]/5 rounded-xl border border-[#0E7490]/20 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Cookie className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Cookie Consent Manager</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        You can change your cookie preferences at any time using our cookie consent manager. 
                        This will reset your preferences and show you the cookie options again.
                      </p>
                      <Button 
                        onClick={() => {
                          localStorage.removeItem('medibot-cookie-consent');
                          window.location.reload();
                        }}
                        className="bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4] hover:from-[#0C6A83] hover:via-[#0E7490] hover:to-[#0891B2] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        Manage Cookie Preferences
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Browser Settings</h4>
                      <p className="text-gray-600 leading-relaxed">
                        You can also control cookies through your browser settings. Please note that disabling 
                        certain cookies may affect the functionality of MediBot and your ability to manage your health data effectively.
                      </p>
                      <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700">Chrome/Edge</p>
                          <p className="text-xs text-gray-500">Settings → Privacy → Cookies</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700">Firefox/Safari</p>
                          <p className="text-xs text-gray-500">Preferences → Privacy → Cookies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card id="contact" className="border-[#0E7490]/20 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 border-b border-[#0E7490]/10">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Questions about cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0E7490] via-[#0891B2] to-[#06B6D4] rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                    <Cookie className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      If you have any questions about our use of cookies or need help managing your preferences, 
                      we're here to help. Our privacy team is committed to transparency and your data protection.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-[#0E7490]/5 to-[#0891B2]/5 rounded-lg border border-[#0E7490]/20">
                          <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#0E7490] rounded-full" />
                            Email Support
                          </div>
                          <p className="text-[#0E7490] font-medium">asvix2025@gmail.com</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-[#0891B2]/5 to-[#06B6D4]/5 rounded-lg border border-[#0891B2]/20">
                          <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#0891B2] rounded-full" />
                            Contact Form
                          </div>
                          <Link 
                            href="/contact" 
                            className="text-[#0891B2] hover:text-[#0E7490] font-medium underline decoration-2 underline-offset-2 transition-colors"
                          >
                            Get in Touch
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 rounded-lg border border-emerald-200">
                          <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            Privacy Policy
                          </div>
                          <Link 
                            href="/privacy" 
                            className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-2 underline-offset-2 transition-colors"
                          >
                            View Full Privacy Policy
                          </Link>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-purple-50/50 to-purple-100/50 rounded-lg border border-purple-200">
                          <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            Response Time
                          </div>
                          <p className="text-purple-600 font-medium">Within 24-48 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}