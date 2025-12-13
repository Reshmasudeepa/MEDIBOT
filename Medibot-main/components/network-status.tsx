"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) {
        return null;
    }

    return (
        <div className="flex items-center justify-center p-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
            <WifiOff className="h-4 w-4 mr-2" />
            <span>You are currently offline. Some features may be unavailable.</span>
        </div>
    );
}
