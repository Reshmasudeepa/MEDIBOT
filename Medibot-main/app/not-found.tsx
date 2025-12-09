'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, Bot } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-200 dark:text-blue-800 opacity-20 animate-bounce">
            404
          </div>
        </div>

        {/* MediBot Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          MediBot couldn't find the page you're looking for.
        </p>
        
        <p className="text-base text-gray-500 dark:text-gray-500 mb-8">
          The page might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 min-w-[180px]">
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </button>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold shadow-lg border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 min-w-[180px]"
          >
            <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Popular Pages
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/chat" className="group">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
                  AI Chat
                </p>
              </div>
            </Link>
            
            <Link href="/premium" className="group">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200">
                  Premium
                </p>
              </div>
            </Link>
            
            <Link href="/appointments" className="group">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200">
                  Appointments
                </p>
              </div>
            </Link>
            
            <Link href="/profile" className="group">
              <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300 group-hover:text-pink-800 dark:group-hover:text-pink-200">
                  Profile
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? 
            <Link href="/feedback" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-1">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
