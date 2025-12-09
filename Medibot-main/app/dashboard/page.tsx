"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Menu, Activity, Pill, MessageSquare, TrendingUp, Plus, ArrowRight, ChevronRight, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  getUserHealthRecords,
  getUserMedications,
  subscribeToUserChatSessions,
  type ChatSession,
  type Medication,
  type HealthRecord,
} from "@/lib/firestore"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

function formatDate(timestamp: Date | { seconds: number }) {
  let date: Date
  if (timestamp instanceof Date) {
    date = timestamp
  } else if (timestamp && typeof timestamp.seconds === "number") {
    date = new Date(timestamp.seconds * 1000)
  } else {
    return ""
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DashboardPage() {
  const router = require('next/navigation').useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!user) return

    setLoading(true)

    const unsubscribeChats = subscribeToUserChatSessions(user.uid, (sessions) => {
      setChatSessions(sessions)
      setLoading(false)
    })

    // Fetch medications from Firestore
    const loadMedications = async () => {
      try {
        const meds = await getUserMedications(user.uid)
        setMedications(meds)
      } catch (error) {
        console.error("Error loading medications:", error)
        setMedications([])
      }
    }

    // Fetch health records from Firestore
    const loadHealthRecords = async () => {
      try {
        const records = await getUserHealthRecords(user.uid)
        setHealthRecords(records)
      } catch (error) {
        console.error("Error loading health records:", error)
        setHealthRecords([])
      }
    }

    loadMedications()
    loadHealthRecords()

    return () => {
      unsubscribeChats()
    }
  }, [user])

  // Only consider sessions that actually have messages
  const nonEmptyChatSessions = useMemo(() => {
    return chatSessions.filter((s) => Array.isArray(s.messages) && s.messages.length > 0);
  }, [chatSessions]);

  const totalMessages = nonEmptyChatSessions.reduce((total, session) => {
    return total + (session.messages && Array.isArray(session.messages) ? session.messages.length : 0)
  }, 0)

  const activeMedications = medications.filter((med) => med.isActive).length

  const recentActivity = nonEmptyChatSessions
    .flatMap((session) =>
      session.messages && Array.isArray(session.messages)
        ? session.messages.map((msg) => ({
            ...msg,
            sessionTitle: session.title,
            sessionId: session.id,
          }))
        : []
    )
    .sort((a, b) => {
      const getSeconds = (t: Date | { seconds: number }) =>
        t instanceof Date ? t.getTime() / 1000 : t.seconds
      return getSeconds(b.timestamp) - getSeconds(a.timestamp)
    })
    .slice(0, 5)

  const calculateHealthScore = () => {
    let score = 50
  if (nonEmptyChatSessions.length > 0) score += 20
    if (medications.length > 0) score += 15
    if (healthRecords.length > 0) score += 15
    return Math.min(score, 100)
  }

  const handleCreateSampleData = async () => {
    toast.error("Sample health record creation is not available.")
  }

  const healthScore = calculateHealthScore()
  const healthStatus = healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs Improvement"

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Modern Header */}
          <header className="sticky top-0 z-20 bg-white/80 dark:bg-background/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4" style={{ marginLeft: '40px' }}>
              <div className="flex items-center gap-4">
                {/* Removed dashboard page menu icon button for small screens */}
                <div className="relative">
                  <Image src="/logo.png" alt="Medibot Icon" width={40} height={40} className="rounded-full shadow-lg" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></span>
                </div>
                <div>
                  <h1 className="font-bold text-lg md:text-2xl text-primary">{userProfile?.displayName || "User"}</h1>
                  <p className="text-xs text-muted-foreground">Last active: Today</p>
                </div>
              </div>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Active</span>
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <section className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/10">
            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Welcome back, <span className="text-primary">{userProfile?.displayName || "User"}</span>!</h2>
                  <p className="text-base text-muted-foreground">Your personalized health overview for today</p>
                </div>
               
              </div>

              {/* Stats Grid - Modern Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Chat Sessions Card */}
                <Card className="rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-background/90 hover:scale-[1.03] transition-transform duration-200">
                  <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">Chat Sessions</CardTitle>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="text-3xl font-bold text-primary mb-1 animate-fadeIn">{nonEmptyChatSessions.length}</div>
                    <div className="text-xs text-muted-foreground">{totalMessages} total messages</div>
                  </CardContent>
                </Card>

                {/* Medications Card */}
                <Card className="rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-background/90 hover:scale-[1.03] transition-transform duration-200">
                  <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">Medications</CardTitle>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="text-3xl font-bold text-primary mb-1 animate-fadeIn">{medications.length}</div>
                    <div className="text-xs text-muted-foreground">{medications.length > 0 ? `${medications.length} total medications` : "No medications"}</div>
                  </CardContent>
                </Card>

                {/* WellBeing Meter Card */}
                <Card className="rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-background/90 hover:scale-[1.03] transition-transform duration-200">
                  <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">
                      WellBeing Meter
                    </CardTitle>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="text-3xl font-bold text-primary animate-fadeIn" style={{ color: healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#EF4444' }}>{healthScore}</div>
                      <span className="text-xs text-muted-foreground mb-1">{healthStatus}</span>
                    </div>
                    <Progress value={healthScore} className="h-2 bg-muted/80 rounded-full" />
                  </CardContent>
                </Card>

                {/* Health Records Card */}
                <Card className="rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-background/90 hover:scale-[1.03] transition-transform duration-200">
                  <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">Health Records</CardTitle>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="text-3xl font-bold text-primary mb-1 animate-fadeIn">{healthRecords.length}</div>
                    <div className="text-xs text-muted-foreground">{healthRecords.length > 0 ? "Documents available" : "No records yet"}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions - Modern Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <Link href="/chat" className="group">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all rounded-xl shadow-sm">
                    <MessageSquare className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">New Chat</span>
                  </Button>
                </Link>
                <Link href="/medications" className="group">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all rounded-xl shadow-sm">
                    <Pill className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">Add Meds</span>
                  </Button>
                </Link>
                <Link href="/summarizer" className="group">
                  <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all rounded-xl shadow-sm">
                    <Activity className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">Medical Info</span>
                  </Button>
                </Link>
                {/* Appointments feature temporarily disabled */}
              </div>

              {/* Recent Activity - Modern Card */}
              <Card className="rounded-2xl shadow-lg border border-primary/20 bg-white/90 dark:bg-background/90 mt-8">
                <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Your latest interactions with MediBot</CardDescription>
                  </div>
                  <Link href="/history">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-full">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">Loading your activity...</p>
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 bg-muted/10 rounded-xl hover:bg-muted/30 transition-colors group shadow-sm cursor-pointer"
                          onClick={() => {
                            if (activity.sessionId) {
                              router.push(`/chat?sessionId=${activity.sessionId}`);
                            }
                          }}
                        >
                          <div className="relative mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-0 group-hover:opacity-40"></div>
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-2 font-medium">{activity.message}</p>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground gap-2">
                              <span className="truncate">in {activity.sessionTitle}</span>
                              <span>•</span>
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-2 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-foreground">No recent activity</h3>
                        <p className="text-sm text-muted-foreground mt-1">Start a conversation to see your activity here</p>
                      </div>
                      <Link href="/chat">
                        <Button className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold">Start Chat</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
