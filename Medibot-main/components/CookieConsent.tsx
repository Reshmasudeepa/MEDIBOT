"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Cookie, Check, Settings, X, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const checkCookieConsent = () => {
      const consent = localStorage.getItem('medibot-cookie-consent');
      const consentTimestamp = localStorage.getItem('medibot-cookie-consent-timestamp');
      const lastShown = localStorage.getItem('medibot-cookie-last-shown');
      const currentTime = Date.now();

      // If no consent ever given, show popup
      if (!consent) {
        setShowConsent(true);
        localStorage.setItem('medibot-cookie-last-shown', currentTime.toString());
        return;
      }

      // If consent exists but no timestamp (legacy), treat as recent
      if (!consentTimestamp) {
        localStorage.setItem('medibot-cookie-consent-timestamp', currentTime.toString());
        return;
      }

      const consentTime = parseInt(consentTimestamp);
      const daysSinceConsent = (currentTime - consentTime) / (1000 * 60 * 60 * 24);

      // Show popup again after 30 days if they haven't made a choice recently
      if (daysSinceConsent > 30) {
        // Check if we showed it recently (don't spam)
        if (!lastShown || (currentTime - parseInt(lastShown)) > (1000 * 60 * 60 * 24)) { // 24 hours
          setShowConsent(true);
          localStorage.setItem('medibot-cookie-last-shown', currentTime.toString());
        }
        return;
      }

      // If user cleared cookies recently (consent exists but timestamp is very old)
      if (daysSinceConsent < 0) {
        setShowConsent(true);
        localStorage.setItem('medibot-cookie-last-shown', currentTime.toString());
        return;
      }
    };

    // Check immediately
    checkCookieConsent();

    // Also check when user becomes active (page focus)
    const handleFocus = () => checkCookieConsent();
    window.addEventListener('focus', handleFocus);

    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleAcceptAll = () => {
    const timestamp = Date.now();
    localStorage.setItem('medibot-cookie-consent', 'accepted');
    localStorage.setItem('medibot-cookie-consent-timestamp', timestamp.toString());
    localStorage.setItem('medibot-cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }));
    setShowConsent(false);
    setShowDetails(false);
  };

  const handleSavePreferences = () => {
    const timestamp = Date.now();
    localStorage.setItem('medibot-cookie-consent', 'customized');
    localStorage.setItem('medibot-cookie-consent-timestamp', timestamp.toString());
    localStorage.setItem('medibot-cookie-preferences', JSON.stringify(preferences));
    setShowConsent(false);
    setShowDetails(false);
  };

  const handleAcceptNecessary = () => {
    const timestamp = Date.now();
    localStorage.setItem('medibot-cookie-consent', 'necessary-only');
    localStorage.setItem('medibot-cookie-consent-timestamp', timestamp.toString());
    localStorage.setItem('medibot-cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }));
    setShowConsent(false);
    setShowDetails(false);
  };

  const handleRemindLater = () => {
    const timestamp = Date.now();
    localStorage.setItem('medibot-cookie-last-shown', timestamp.toString());
    setShowConsent(false);
    setShowDetails(false);
  };

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/60 z-[9999] pointer-events-none"
      >
        <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-auto">
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              opacity: { duration: 0.3 }
            }}
            className="max-w-6xl mx-auto"
          >
            <Card className="border-2 border-[#0E7490]/20 shadow-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl overflow-hidden">
              {/* Gradient top border */}
              <div className="h-1 bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4]" />
              
              <CardContent className="p-6">
                {!showDetails ? (
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="flex-1 space-y-3">
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#0E7490] via-[#0891B2] to-[#06B6D4] rounded-xl flex items-center justify-center shadow-lg">
                            <Cookie className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-md" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 tracking-tight mb-1">
                            🛡️ We value your privacy
                          </h3>
                          <div className="flex items-center gap-2 text-sm font-medium text-[#0E7490]">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Secure • Transparent • Your Choice
                          </div>
                        </div>
                      </motion.div>

                      <motion.p 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-gray-600 text-base leading-relaxed"
                      >
                        MediBot uses essential cookies to secure your health data, remember your medication schedules, 
                        and provide personalized reminders. We also use analytics to improve our services.
                      </motion.p>
                      
                      <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex items-center gap-6 text-sm"
                      >
                        <Link 
                          href="/cookies" 
                          className="inline-flex items-center gap-2 text-[#0E7490] hover:text-[#0C6A83] font-semibold underline decoration-2 underline-offset-4 transition-all duration-200 hover:decoration-[#0C6A83] group"
                        >
                          <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
                          Cookie Details
                        </Link>
                        <span className="text-gray-300 font-medium">•</span>
                        <Link 
                          href="/privacy" 
                          className="inline-flex items-center gap-2 text-[#0E7490] hover:text-[#0C6A83] font-semibold underline decoration-2 underline-offset-4 transition-all duration-200 hover:decoration-[#0C6A83] group"
                        >
                          <Shield className="w-4 h-4 transition-transform group-hover:scale-110" />
                          Privacy Policy
                        </Link>
                      </motion.div>

                      <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="text-xs text-gray-500 text-center"
                      >
                        💡 This popup will appear again in 30 days if you haven't made a choice
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="lg:flex-shrink-0"
                    >
                      <div className="flex flex-col gap-3 min-w-[300px]">
                        <Button
                          onClick={handleAcceptAll}
                          className="relative bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#06B6D4] hover:from-[#0C6A83] hover:via-[#0E7490] hover:to-[#0891B2] text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <Check className="w-4 h-4 transition-transform group-hover:scale-110 relative z-10" />
                          <span className="relative z-10">Accept All Cookies</span>
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowDetails(true)}
                            variant="outline"
                            className="flex-1 border-2 border-[#0E7490]/40 text-[#0E7490] hover:bg-gradient-to-r hover:from-[#0E7490]/10 hover:to-[#0891B2]/10 hover:border-[#0E7490]/60 px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-1 group text-sm"
                          >
                            <Settings className="w-3 h-3 transition-transform group-hover:rotate-45" />
                            Customize
                          </Button>
                          
                          <Button
                            onClick={handleAcceptNecessary}
                            variant="outline"
                            className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm"
                          >
                            Necessary Only
                          </Button>

                          <Button
                            onClick={handleRemindLater}
                            variant="ghost"
                            className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm"
                          >
                            Remind Later
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#0E7490] to-[#0891B2] rounded-xl flex items-center justify-center">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Cookie Preferences</h3>
                      </div>
                      <Button
                        onClick={() => setShowDetails(false)}
                        variant="outline"
                        size="icon"
                        className="border-gray-300 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Customize which cookies you want to accept. Essential cookies are required for basic functionality.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">🔒 Essential Cookies</h4>
                          <p className="text-sm text-gray-600">Required for authentication, security, and core functionality</p>
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">📊 Analytics Cookies</h4>
                          <p className="text-sm text-gray-600">Help us understand usage patterns to improve MediBot</p>
                        </div>
                        <Switch
                          checked={preferences.analytics}
                          onCheckedChange={(checked) => setPreferences({...preferences, analytics: checked})}
                          className="data-[state=checked]:bg-[#0E7490]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">⚙️ Functional Cookies</h4>
                          <p className="text-sm text-gray-600">Remember your preferences and personalize your experience</p>
                        </div>
                        <Switch
                          checked={preferences.functional}
                          onCheckedChange={(checked) => setPreferences({...preferences, functional: checked})}
                          className="data-[state=checked]:bg-[#0E7490]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">🎯 Marketing Cookies</h4>
                          <p className="text-sm text-gray-600">Enable personalized content and relevant health tips</p>
                        </div>
                        <Switch
                          checked={preferences.marketing}
                          onCheckedChange={(checked) => setPreferences({...preferences, marketing: checked})}
                          className="data-[state=checked]:bg-[#0E7490]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button
                        onClick={handleSavePreferences}
                        className="flex-1 bg-gradient-to-r from-[#0E7490] to-[#0891B2] hover:from-[#0C6A83] hover:to-[#0E7490] text-white font-semibold py-2.5 text-sm"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        variant="outline"
                        className="flex-1 border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490]/10 py-2.5 text-sm"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={handleRemindLater}
                        variant="ghost"
                        className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-2.5 text-sm"
                      >
                        Remind Later
                      </Button>
                    </div>

                    <motion.div 
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="text-xs text-gray-500 text-center mt-3"
                    >
                      💡 You can change your preferences anytime from our cookie settings
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}