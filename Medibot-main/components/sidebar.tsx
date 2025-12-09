"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  FileText,
  Pill,
  History,
  User,
  Moon,
  Sun,
  LogOut,
  Calendar,
  Menu,
  MessageSquare,
  X,
  Smartphone,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, userProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const menuItems = [
    { icon: MessageCircle, label: "AI Chatbot", href: "/chat" },
    { icon: FileText, label: "Info Summarizer", href: "/summarizer" },
    // Appointments temporarily disabled
    { icon: Pill, label: "Medications", href: "/medications" },
    { icon: History, label: "Chat History", href: "/history" },
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: MessageSquare, label: "Feedback", href: "/feedback" },
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      setSidebarOpen(false);
      if (onClose) onClose();
      setShowProfileOptions(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    if (onClose && !sidebarOpen) onClose();
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
    setShowProfileOptions(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSidebarOpen(false);
      setShowProfileOptions(false);
      if (onClose) onClose();
    }
  };

  const toggleProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Close profile options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileOptions) {
        const profileSection = document.getElementById("profile-section");
        
        if (profileSection && !profileSection.contains(event.target as Node)) {
          setShowProfileOptions(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileOptions]);

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <div className="lg:flex lg:items-start">
        {/* Enhanced Sidebar Toggle Button (Mobile) */}
        <Button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          variant="ghost"
          size="icon"
          className={cn(
            "fixed z-50 h-10 w-10 lg:hidden transition-all duration-300",
            "text-foreground hover:bg-transparent",
            sidebarOpen ? "left-[240px] top-4" : "left-4 top-4"
          )}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card border-r border-border",
            "transition-all duration-300 ease-in-out",
            "flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 lg:static lg:inset-0",
            isMobile ? "w-[280px]" : "w-[250px]",
            collapsed && "lg:w-[80px]"
          )}
          style={{
            height: "100vh",
            position: isMobile ? "fixed" : "sticky",
            top: 0,
          }}
        >
          <div className="flex flex-col h-full p-4">
            {/* Logo + Collapse/Close */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/logo.png"
                      alt="MedBot Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  {!collapsed && (
                    <span className="text-foreground font-semibold text-lg">
                      Medibot
                    </span>
                  )}
                </div>

                {isMobile ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="h-8 w-8"
                    aria-label="Close sidebar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {collapsed ? (
                      <span className="text-lg font-mono">››</span>
                    ) : (
                      <span className="text-lg font-mono">‹‹</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center font-sans h-12 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-purple-600 text-white shadow"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        collapsed ? "justify-center" : "px-4"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Get the App Section */}
            <div className="relative group w-full mb-4">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "flex items-center w-full h-12 rounded-xl px-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200",
                  collapsed && "justify-center px-0"
                )}
              >
                <Smartphone className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3 font-medium">Get the App</span>}
              </Button>

              {/* QR Code Popup */}
              {!collapsed && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-36 p-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-bottom z-50 pointer-events-none group-hover:pointer-events-auto text-center">
                  <p className="text-xs font-medium text-foreground mb-2">Scan QR to Download</p>
                  <img
                    src="/qr.png"
                    alt="Download App QR"
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </div>
              )}
            </div>

            {/* Bottom: Profile with integrated options */}
            <div className="flex-shrink-0 pt-4 border-t border-border">
              {!collapsed ? (
                <div id="profile-section" className="space-y-2">
                  {/* Profile section that toggles options when clicked */}
                  <div
                    onClick={toggleProfileOptions}
                    className={cn(
                      "bg-muted rounded-xl p-4 border border-border cursor-pointer transition-all",
                      showProfileOptions ? "rounded-b-none" : "hover:bg-muted/80"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={userProfile?.photoURL || user?.photoURL || ""}
                        />
                        <AvatarFallback className="bg-purple-600 text-white font-semibold">
                          {userProfile?.displayName?.charAt(0).toUpperCase() ||
                            user?.displayName?.charAt(0).toUpperCase() ||
                            user?.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium truncate">
                          {userProfile?.displayName ||
                            user?.displayName ||
                            user?.email?.split("@")[0] ||
                            "User"}
                        </p>
                        <p className="text-muted-foreground text-sm truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Theme and Sign Out options */}
                  {showProfileOptions && (
                    <div className="bg-muted rounded-b-xl border border-border border-t-0 overflow-hidden">
                      <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        className="w-full justify-start h-12 rounded-none px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5 mr-3" />
                        ) : (
                          <Moon className="h-5 w-5 mr-3" />
                        )}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </Button>

                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-none px-4 text-muted-foreground hover:text-red-400 hover:bg-muted/50"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Collapsed state
                <div className="flex flex-col items-center space-y-2">
                  <div
                    onClick={toggleProfileOptions}
                    className="cursor-pointer p-2 rounded-full hover:bg-muted transition-colors"
                    title="Profile options"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={userProfile?.photoURL || user?.photoURL || ""}
                      />
                      <AvatarFallback className="bg-purple-600 text-white text-sm">
                        {userProfile?.displayName?.charAt(0).toUpperCase() ||
                          user?.displayName?.charAt(0).toUpperCase() ||
                          user?.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Theme and Sign Out options for collapsed state */}
                  {showProfileOptions && (
                    <div className="bg-muted rounded-xl border border-border p-2 w-full space-y-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="w-full h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5" />
                        ) : (
                          <Moon className="h-5 w-5" />
                        )}
                      </Button>

                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        size="icon"
                        className="w-full h-10 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-muted/50"
                        title="Sign Out"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}