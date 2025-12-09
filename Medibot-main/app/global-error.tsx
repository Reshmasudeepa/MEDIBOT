'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-red-950 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Something went wrong!
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              MediBot encountered an unexpected error.
            </p>
            
            <p className="text-base text-gray-500 dark:text-gray-500 mb-8">
              Don't worry, this has been logged and we'll look into it.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</h3>
                <code className="text-sm text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={reset}
                className="group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 min-w-[180px]"
              >
                <RefreshCw className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Try Again
              </button>

              <Link href="/">
                <button className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold shadow-lg border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 min-w-[180px]">
                  <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Back to Home
                </button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If this problem persists, please 
                <Link href="/feedback" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium ml-1">
                  report it to us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
