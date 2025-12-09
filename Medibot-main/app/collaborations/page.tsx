"use client";

import {
  ArrowLeft,
  Building2,
  Stethoscope,
  Shield,
  Activity,
  Users,
  Globe,
  Award,
  Heart,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CollaborationsPage() {
  const [activeTab, setActiveTab] = useState("healthcare");
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    partners: 0,
    countries: 0,
    projects: 0,
    patients: 0
  });

  // Fetch real user count from Firebase
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users from Firebase
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const realUserCount = usersSnapshot.size;
        
        console.log(`✅ Fetched ${realUserCount} real users from Firebase for collaborations page`);
        
        // Set the real user count
        setUserCount(realUserCount);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error fetching user count for collaborations:", error);
        // Fallback to a default count if Firebase fails
        setUserCount(25);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    };

    fetchUserCount();

    // Optional: Set up real-time updates (uncomment if needed)
    // const interval = setInterval(fetchUserCount, 60000); // Update every minute
    // return () => clearInterval(interval);
  }, []);

  // Animate statistics with real user count
  useEffect(() => {
    if (!isLoading && userCount > 0) {
      const targets = { partners: 1, countries: 1, projects: 1, patients: userCount };
      const duration = 2500;
      
      Object.entries(targets).forEach(([key, target]) => {
        const increment = target / (duration / 50);
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setAnimatedStats(prev => ({ ...prev, [key]: target }));
            clearInterval(timer);
          } else {
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
          }
        }, 50);
      });
    }
  }, [userCount, isLoading]);

  // Function to manually refresh user count
  const refreshUserCount = async () => {
    try {
      setIsLoading(true);
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const realUserCount = usersSnapshot.size;
      
      console.log(`🔄 Refreshed: ${realUserCount} users from Firebase`);
      
      setUserCount(realUserCount);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error refreshing user count:", error);
      setIsLoading(false);
    }
  };

  const collaborationCategories = {
    healthcare: {
      title: "Healthcare Partnership",
      icon: <Stethoscope className="h-6 w-6" />,
      description: "Our flagship collaboration with a distinguished healthcare expert and researcher",
      partners: [
        {
          name: "Dr. Saikat Gochhait (Honoris Causa)",
          type: "Healthcare Research & Clinical Partner",
          location: "India",
          description: "Strategic collaboration with Dr. Saikat Gochhait, a distinguished healthcare professional and researcher, to integrate evidence-based medical practices with MediBot's AI-powered health management system. This partnership focuses on enhancing clinical decision support and improving patient care outcomes through innovative digital health solutions.",
          impact: isLoading ? "Loading patients data..." : `${userCount}+ patients reached through collaborative initiatives`,
          status: "Active",
          logo: "/logo.png",
          videoUrl: "/collab1.mp4", // Using local video file
          website: "https://www.linkedin.com/in/dr-saikat-gochhait-honoris-causa-73643229/",
          established: "2024",
          linkedinProfile: "https://www.linkedin.com/in/dr-saikat-gochhait-honoris-causa-73643229/"
        }
      ]
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#e8f5e9] to-[#e3f2fd] text-[#263238]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
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
              <h1 className="text-xl font-bold text-[#00796b]">MediBot Collaborations</h1>
            </div>
          </div>
          <Link href="/auth/signin">
            <Button className="bg-gradient-to-r from-[#00acc1] to-[#42a5f5] text-white hover:from-[#00838f] hover:to-[#1e88e5] rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#e8f5e9] rounded-full mb-6">
            <Users className="h-8 w-8 text-[#4caf50]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#263238] mb-6">
            Our Global{" "}
            <span className="bg-gradient-to-r from-[#4caf50] to-[#00acc1] bg-clip-text text-transparent">
              Partnerships
            </span>
          </h1>
          <p className="text-xl text-[#546e7a] max-w-3xl mx-auto mb-8">
            We collaborate with distinguished healthcare professionals and researchers like Dr. Saikat Gochhait (Honoris Causa) 
            to advance evidence-based digital health innovation and improve clinical decision-making through AI-powered solutions.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { 
                number: animatedStats.partners, 
                label: "Active Partner", 
                icon: <Building2 className="h-6 w-6" />,
                color: "text-[#4caf50]",
                bgColor: "bg-green-50"
              },
              { 
                number: animatedStats.countries, 
                label: "Country", 
                icon: <Globe className="h-6 w-6" />,
                color: "text-[#00acc1]",
                bgColor: "bg-cyan-50"
              },
              { 
                number: animatedStats.projects, 
                label: "Pilot Project", 
                icon: <Award className="h-6 w-6" />,
                color: "text-[#42a5f5]",
                bgColor: "bg-blue-50"
              },
              { 
                number: isLoading ? "Loading..." : (animatedStats.patients > 0 ? `${animatedStats.patients.toLocaleString()}+` : "0"), 
                label: "Patients Reached", 
                icon: <Users className="h-6 w-6" />,
                color: "text-[#ff7043]",
                bgColor: "bg-orange-50"
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  y: -5 
                }}
                className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer`}
              >
                <div className={`flex justify-center mb-4 ${stat.color}`}>
                  <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r from-[#4caf50] to-[#00acc1] bg-clip-text text-transparent mb-2 ${isLoading ? 'animate-pulse' : ''}`}>
                  {typeof stat.number === 'number' ? stat.number : stat.number}
                </div>
                <div className="text-[#546e7a] text-sm font-medium">{stat.label}</div>
                {stat.label === "Patients Reached" && (
                  <div className="flex items-center justify-center mt-2">
                    <button
                      onClick={refreshUserCount}
                      disabled={isLoading}
                      className="flex items-center space-x-1 text-xs text-[#4caf50] hover:text-[#2e7d32] transition-colors disabled:opacity-50"
                      title="Refresh real-time data"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Live Data</span>
                    </button>
                  </div>
                )}
                {stat.label === "Patients Reached" && lastUpdated && (
                  <div className="text-xs text-[#546e7a] mt-1">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r from-[#4caf50] to-[#00acc1]`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tab Navigation - Removed since we have only one category */}
        
        {/* Single Collaboration Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#263238] mb-4">
              Our Strategic Healthcare Partnership
            </h2>
            <p className="text-lg text-[#546e7a] max-w-2xl mx-auto">
              Collaborating with distinguished healthcare professionals to advance digital health innovation
            </p>
          </div>

          {/* Featured Partnership Card with Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
              {/* Video Section */}
              <div className="relative h-64 md:h-96 bg-gradient-to-r from-[#4caf50] to-[#00acc1] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster="/logo.png" // Using logo as poster image
                >
                  <source src={collaborationCategories.healthcare.partners[0].videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live Partnership</span>
                  </div>
                </div>
                
                <div className="absolute top-0 right-1 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                  Collaboration Video
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start justify-between mb-8">
                  <div className="flex items-center space-x-6 mb-6 md:mb-0">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-[#4caf50] to-[#00acc1] rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={collaborationCategories.healthcare.partners[0].logo}
                        alt={`${collaborationCategories.healthcare.partners[0].name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="text-2xl md:text-3xl font-bold text-[#263238] mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {collaborationCategories.healthcare.partners[0].name}
                      </motion.h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                            {collaborationCategories.healthcare.partners[0].status}
                          </Badge>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Badge variant="secondary" className="hover:bg-gray-200 transition-colors">
                            {collaborationCategories.healthcare.partners[0].type}
                          </Badge>
                        </motion.div>
                        <motion.span 
                          className="text-[#546e7a] flex items-center hover:text-[#4caf50] transition-colors cursor-pointer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          {collaborationCategories.healthcare.partners[0].location}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="text-right bg-gradient-to-br from-green-50 to-cyan-50 p-4 rounded-xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-sm text-[#546e7a] mb-1">Partnership Established</div>
                    <div className="text-2xl font-bold text-[#4caf50]">
                      {collaborationCategories.healthcare.partners[0].established}
                    </div>
                    <div className="text-xs text-[#546e7a] mt-1">
                      {new Date().getFullYear() - parseInt(collaborationCategories.healthcare.partners[0].established)} year active
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h4 className="text-lg font-semibold text-[#263238] mb-4 flex items-center">
                      <div className="w-2 h-6 bg-gradient-to-b from-[#4caf50] to-[#00acc1] rounded-full mr-3"></div>
                      Partnership Overview
                    </h4>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                      <p className="text-[#546e7a] text-base leading-relaxed mb-6">
                        {collaborationCategories.healthcare.partners[0].description}
                      </p>
                      
                      <motion.div 
                        className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg border border-green-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-[#4caf50]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#4caf50] mb-1">Partnership Impact</div>
                          <div className="text-sm text-[#546e7a]">
                            {collaborationCategories.healthcare.partners[0].impact}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h4 className="text-lg font-semibold text-[#263238] mb-4 flex items-center">
                      <div className="w-2 h-6 bg-gradient-to-b from-[#00acc1] to-[#42a5f5] rounded-full mr-3"></div>
                      Key Achievements
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          text: "Evidence-based medical practice integration",
                          icon: <Shield className="h-4 w-4" />,
                          color: "text-blue-600"
                        },
                        {
                          text: isLoading ? "Loading patient data..." : `${userCount.toLocaleString()}+ patients reached through collaborative research`,
                          icon: <Users className="h-4 w-4" />,
                          color: "text-green-600"
                        },
                        {
                          text: "Clinical decision support system development",
                          icon: <Activity className="h-4 w-4" />,
                          color: "text-purple-600"
                        },
                        {
                          text: "Healthcare professional training and education",
                          icon: <Stethoscope className="h-4 w-4" />,
                          color: "text-cyan-600"
                        },
                        {
                          text: "Research-driven AI health management protocols",
                          icon: <Award className="h-4 w-4" />,
                          color: "text-orange-600"
                        },
                        {
                          text: "Academic-industry collaboration framework",
                          icon: <Building2 className="h-4 w-4" />,
                          color: "text-indigo-600"
                        }
                      ].map((achievement, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-50 ${achievement.color} mr-4`}>
                            {achievement.icon}
                          </div>
                          <span className="text-[#546e7a] text-sm flex-1">{achievement.text}</span>
                          <CheckCircle className="h-4 w-4 text-[#4caf50] ml-2 flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200">
                  <div className="text-[#546e7a] text-sm mb-4 sm:mb-0">
                    Partnership since {collaborationCategories.healthcare.partners[0].established}
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="text-[#4caf50] border-[#4caf50] hover:bg-[#4caf50] hover:text-white">
                      View Case Study
                    </Button>
                    <Button className="bg-gradient-to-r from-[#4caf50] to-[#00acc1] text-white hover:from-[#2e7d32] hover:to-[#00838f]">
                      <a href={collaborationCategories.healthcare.partners[0].linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        View LinkedIn Profile
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* Partnership Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#263238] mb-4">
              Partnership{" "}
              <span className="bg-gradient-to-r from-[#4caf50] to-[#00acc1] bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-lg text-[#546e7a] max-w-2xl mx-auto">
              Milestones in our collaborative healthcare innovation journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#4caf50] to-[#00acc1] rounded-full"></div>
              
              {[
                {
                  date: "Q1 2024",
                  title: "Partnership Initiation",
                  description: "Initial collaboration discussions with Dr. Saikat Gochhait to explore AI integration in healthcare",
                  icon: <Users className="h-6 w-6" />,
                  side: "left"
                },
                {
                  date: "Q2 2024",
                  title: "Research Framework Development",
                  description: "Established evidence-based protocols for AI-powered health management systems",
                  icon: <Shield className="h-6 w-6" />,
                  side: "right"
                },
                {
                  date: "Q3 2024",
                  title: "Pilot Program Launch",
                  description: "Deployed initial clinical decision support systems reaching first patient cohorts",
                  icon: <Activity className="h-6 w-6" />,
                  side: "left"
                },
                {
                  date: "Q4 2024",
                  title: "Scale & Impact",
                  description: isLoading ? "Loading patient count..." : `Successfully reached ${userCount.toLocaleString()}+ patients through collaborative initiatives`,
                  icon: <Award className="h-6 w-6" />,
                  side: "right"
                }
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                    milestone.side === 'left' ? 'justify-start' : 'justify-end'
                  }`}
                  initial={{ opacity: 0, x: milestone.side === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#4caf50] rounded-full z-10"></div>
                  
                  {/* Content card */}
                  <motion.div
                    className={`w-5/12 ${milestone.side === 'left' ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-gradient-to-br from-[#4caf50] to-[#00acc1] rounded-lg text-white mr-3">
                          {milestone.icon}
                        </div>
                        <div className="text-sm font-semibold text-[#4caf50]">{milestone.date}</div>
                      </div>
                      <h3 className="text-lg font-bold text-[#263238] mb-2">{milestone.title}</h3>
                      <p className="text-[#546e7a] text-sm">{milestone.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Partnership Benefits */}
        <motion.section 
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 mb-16 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4caf50]/10 to-[#00acc1]/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#42a5f5]/10 to-[#4caf50]/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold text-[#263238] mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Why Partner with{" "}
                <span className="bg-gradient-to-r from-[#4caf50] to-[#00acc1] bg-clip-text text-transparent">
                  MediBot?
                </span>
              </motion.h2>
              <motion.p 
                className="text-lg text-[#546e7a] max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Join our ecosystem of innovation and make a meaningful impact on global healthcare
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Activity className="h-8 w-8" />,
                  title: "Innovation Leadership",
                  description: "Be at the forefront of digital health transformation with cutting-edge AI technology",
                  color: "from-[#4caf50] to-[#66bb6a]",
                  bgColor: "bg-green-50",
                  hoverColor: "hover:bg-green-100"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Patient Impact",
                  description: "Improve patient outcomes and medication adherence through proven digital solutions",
                  color: "from-[#00acc1] to-[#29b6f6]",
                  bgColor: "bg-cyan-50",
                  hoverColor: "hover:bg-cyan-100"
                },
                {
                  icon: <Globe className="h-8 w-8" />,
                  title: "Global Reach",
                  description: "Access our worldwide network of healthcare providers and technology partners",
                  color: "from-[#42a5f5] to-[#64b5f6]",
                  bgColor: "bg-blue-50",
                  hoverColor: "hover:bg-blue-100"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`text-center group cursor-pointer ${benefit.bgColor} ${benefit.hoverColor} p-8 rounded-2xl border border-gray-100 transition-all duration-300`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                >
                  <motion.div 
                    className={`inline-flex items-center justify-center p-4 bg-gradient-to-br ${benefit.color} rounded-2xl mb-6 text-white shadow-lg group-hover:shadow-xl transition-all`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[#263238] mb-3 group-hover:text-[#4caf50] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-[#546e7a] leading-relaxed group-hover:text-[#263238] transition-colors">
                    {benefit.description}
                  </p>
                  
                  {/* Animated underline */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${benefit.color} rounded-full mt-4 mx-auto`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#4caf50] to-[#00acc1] rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our mission to transform healthcare through technology. Let's create better health outcomes together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-[#4caf50] hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Become a Partner
            </Button>
            <Button className="bg-white text-[#4caf50] hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Learn More
            </Button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/logo.png"
              alt="MediBot Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-[#00796b]">MediBot</span>
          </div>
          <p className="text-[#546e7a]">
            © {new Date().getFullYear()} MediBot by Asvix. All rights reserved. | In collaboration with Dr. Saikat Gochhait
          </p>
        </div>
      </footer>
    </div>
  );
}