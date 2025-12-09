import type { Metadata } from "next";
import React from "react";
import { SmoothNavigator, GlobalSkeletonLoader } from "../components/SmoothNavigator";
import { LoadingProvider } from "@/components/LoadingContext";
import CookieConsent from "@/components/CookieConsent";
import Head from "next/head";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://medibot-ai.com'),
  title: {
    default: 'MediBot',
    template: '%s | MediBot'
  },
  description: 'Transform your healthcare with MediBot - Your AI-powered health companion for medication management, prescription analysis, and personalized health insights. Join 23+ users trusting MediBot for better health outcomes.',
  keywords: [
    'medication reminder',
    'health app',
    'AI health assistant',
    'prescription tracker',
    'medication management',
    'healthcare app',
    'pill reminder',
    'health chatbot',
    'medical AI',
    'prescription analysis',
    'medication adherence',
    'health technology',
    'digital health',
    'telemedicine',
    'healthcare automation'
  ],
  authors: [{ name: 'Sujay Babu Thota', url: 'https://medibot.vercel.app' }],
  creator: 'Asvix - Sujay Babu Thota',
  publisher: 'Asvix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medibot.vercel.app',
    title: 'MediBot - AI-Powered Health Assistant & Medication Management',
    description: 'Transform your healthcare with MediBot - Your AI-powered health companion for medication management, prescription analysis, and personalized health insights.',
    siteName: 'MediBot',
    images: [
      {
        url: '/main.png',
        width: 1200,
        height: 630,
        alt: 'MediBot - AI Health Assistant Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediBot - AI-Powered Health Assistant & Medication Management',
    description: 'Transform your healthcare with MediBot - Your AI-powered health companion for medication management, prescription analysis, and personalized health insights.',
    creator: '@medibot',
    images: ['/main.png'],
  },
  themeColor: "#00acc1",
  viewport: "width=device-width, initial-scale=1.0",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  applicationName: "MediBot",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MediBot",
  },
  alternates: {
    canonical: 'https://medibot.vercel.app',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'MediBot',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#00acc1',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MediBot",
              "alternateName": "Asvix MediBot",
              "url": "https://medibot.vercel.app",
              "logo": "https://medibot.vercel.app/logo.png",
              "description": "AI-powered health assistant for medication management and personalized health insights",
              "founder": {
                "@type": "Person",
                "name": "Sujay Babu Thota"
              },
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/medibot",
                "https://facebook.com/medibot"
              ]
            })
          }}
        />
        
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MediBot",
              "url": "https://medibot.vercel.app",
              "description": "AI-powered health assistant for medication management and personalized health insights",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://medibot.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Structured Data for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MediBot",
              "operatingSystem": "Android, iOS, Web",
              "applicationCategory": "HealthApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "23"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "description": "AI-powered health assistant for medication management, prescription analysis, and personalized health insights",
              "downloadUrl": "https://medibot.vercel.app/medibot.apk",
              "screenshot": "https://medibot.vercel.app/main.png"
            })
          }}
        />
      </Head>
  <body suppressHydrationWarning className={`${inter.className} bg-background text-foreground min-h-screen fade-in`} style={{ zIndex: 0 }}>
  <LoadingProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothNavigator>
            <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><GlobalSkeletonLoader /></div>}>
              {children}
            </React.Suspense>
          </SmoothNavigator>
          <Toaster position="top-right" />
          <CookieConsent />
        </ThemeProvider>
  </LoadingProvider>
      </body>
    </html>
  );
}