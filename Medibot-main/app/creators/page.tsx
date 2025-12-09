"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, Linkedin, Mail, Globe, Heart, Code, Coffee } from "lucide-react";
import { SystemUtils } from "@/lib/system-utils";

export default function CreatorsPage() {
  const systemData = SystemUtils.getSystemData();
  const creatorName = systemData.systemOwner;

  const creators = [
    {
      id: 1,
      name: creatorName,
      role: "Lead Developer ",
      avatar: "/sujay.png", // Developer profile picture
      bio: "Full-stack developer passionate about healthcare technology and AI. Creator of MediBot, dedicated to making healthcare more accessible through innovative technology solutions.",
      contributions: [
        "AI Chat System Architecture",
        "Medication Reminder Engine", 
        "Prescription Analysis AI",
        "Healthcare Data Security",
        "Mobile App Development",
        "Backend Infrastructure"
      ],
      technologies: [
        "Next.js", "React", "TypeScript", "Node.js", 
        "Firebase", "AI/ML", "Healthcare APIs", "Mobile Development"
      ],
      socialLinks: {
        github: "https://github.com/Sujay149/",
        linkedin: "https://www.linkedin.com/in/sujaybabu", 
        email: "mailto:sujayss149@gmail.com",
        website: "http://sujaybabu.vercel.app/"
      },
      achievements: [
        "Built end-to-end healthcare platform",
        "Implemented secure patient data handling",
        "Created intelligent medication management",
        "Designed user-friendly healthcare UX"
      ]
    } 
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-[#0E7490] hover:text-[#0F766E]">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="MediBot Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-bold text-xl text-[#0E7490]">MediBot</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet the{" "}
              <span className="bg-gradient-to-r from-[#0E7490] to-[#059669] bg-clip-text text-transparent">
                Creators
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The passionate developers behind MediBot, working tirelessly to revolutionize healthcare 
              through innovative AI technology and user-centered design.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { number: "1", label: "Core Developer", icon: Code },
              { number: "10K+", label: "Lines of Code", icon: Coffee },
              { number: "100%", label: "Passion", icon: Heart },
              { number: "24/7", label: "Dedication", icon: Globe }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <stat.icon className="h-8 w-8 text-[#0E7490] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {creators.map((creator, index) => (
              <motion.div key={creator.id} variants={fadeInUp}>
                <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-8 p-8">
                      {/* Creator Profile */}
                      <div className="text-center md:text-left">
                        <div className="relative mb-6">
                          <div className="w-32 h-32 mx-auto md:mx-0 relative">
                            <Image
                              src={creator.avatar}
                              alt={creator.name}
                              fill
                              className="rounded-full object-cover border-4 border-[#0E7490]"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-[#059669] text-white p-2 rounded-full">
                            <Code className="h-4 w-4" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {creator.name}
                        </h3>
                        <Badge variant="secondary" className="mb-4 bg-[#0E7490] text-white">
                          {creator.role}
                        </Badge>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {creator.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center md:justify-start space-x-4">
                          <Link 
                            href={creator.socialLinks.github}
                            className="p-2 bg-gray-100 rounded-full hover:bg-[#0E7490] hover:text-white transition-colors"
                          >
                            <Github className="h-5 w-5" />
                          </Link>
                          <Link 
                            href={creator.socialLinks.linkedin}
                            className="p-2 bg-gray-100 rounded-full hover:bg-[#0E7490] hover:text-white transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </Link>
                          <Link 
                            href={creator.socialLinks.email}
                            className="p-2 bg-gray-100 rounded-full hover:bg-[#0E7490] hover:text-white transition-colors"
                          >
                            <Mail className="h-5 w-5" />
                          </Link>
                          <Link 
                            href={creator.socialLinks.website}
                            className="p-2 bg-gray-100 rounded-full hover:bg-[#0E7490] hover:text-white transition-colors"
                          >
                            <Globe className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>

                      {/* Contributions & Skills */}
                      <div className="md:col-span-2 space-y-8">
                        {/* Key Contributions */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Key Contributions
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {creator.contributions.map((contribution, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg"
                              >
                                <div className="w-2 h-2 bg-[#0E7490] rounded-full"></div>
                                <span className="text-gray-700">{contribution}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Technologies & Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {creator.technologies.map((tech, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline" 
                                className="border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490] hover:text-white transition-colors"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Notable Achievements
                          </h4>
                          <div className="space-y-2">
                            {creator.achievements.map((achievement, idx) => (
                              <div 
                                key={idx}
                                className="flex items-start space-x-3"
                              >
                                <div className="w-5 h-5 bg-[#059669] rounded-full flex items-center justify-center mt-0.5">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-gray-700">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-[#0E7490] to-[#059669]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-xl max-w-4xl mx-auto leading-relaxed opacity-90">
              To democratize healthcare through intelligent technology, making medical guidance, 
              medication management, and health insights accessible to everyone, everywhere. 
              We believe that technology should enhance human well-being and bridge the gap 
              between patients and quality healthcare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about MediBot? Want to collaborate or contribute? 
              We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#0E7490] hover:bg-[#0F766E] text-white"
                asChild
              >
                <Link href="mailto:sujayss149@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490] hover:text-white"
                asChild
              >
                <Link href="/chat">
                  <Heart className="mr-2 h-5 w-5" />
                  Try MediBot
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}