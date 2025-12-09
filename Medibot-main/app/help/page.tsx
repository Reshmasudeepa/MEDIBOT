"use client";
import React, { useState } from "react";

export default function HelpPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: "How to use MediBot features",
      answer: "MediBot offers various features like symptom checking, medication reminders, and health tracking. You can access these from the main dashboard after logging into your account."
    },
    {
      question: "Account setup and management",
      answer: "To set up your account, simply download the app and follow the registration process. You can manage your account settings, including privacy preferences and notification settings, from the profile section."
    },
    {
      question: "Privacy and security information",
      answer: "We take your privacy seriously. All health data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent."
    },
    {
      question: "Contacting support",
      answer: "Our support team is available 24/7 through phone, email, or the in-app chat feature. Typical response time is under 2 hours for urgent inquiries."
    }
  ];

  const resources = [
    {
      title: "User Guides",
      description: "Step-by-step instructions for all features",
      icon: "📚"
    },
    {
      title: "Video Tutorials",
      description: "Visual guides for getting started",
      icon: "🎥"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: "👥"
    },
    {
      title: "Health Tips",
      description: "Maximize your wellness journey",
      icon: "💡"
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="pt-8 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          MediBot Help Center
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions, troubleshooting tips, and resources to get the most out of MediBot.
        </p>
        
        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        {/* Resources Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
                <div className="text-3xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-400">{resource.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.map((item, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                <button
                  className="flex justify-between items-center w-full p-5 text-left font-medium text-lg hover:bg-gray-700/30 transition"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeIndex === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {activeIndex === index && (
                  <div className="p-5 bg-gray-750 border-t border-gray-700">
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl text-gray-300">Our support team is here to assist you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start">
              <div className="bg-blue-600/20 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                <a href="tel:9346491221" className="text-blue-400 hover:text-blue-300 transition">9346491221</a>
                <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-600/20 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                <a href="mailto:sujayss149@gmail.com" className="text-purple-400 hover:text-purple-300 transition">sujayss149@gmail.com</a>
                <p className="text-sm text-gray-400 mt-1">Typically respond within 2 hours</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              Contact Support
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MediBot AI. All rights reserved.</p>
      </footer>
    </div>
  );
}