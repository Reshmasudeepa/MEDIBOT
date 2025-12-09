"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import React, { useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SmoothNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPending] = useTransition();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const showGlobalSkeleton = isPending;

  return (
    <>
      {showGlobalSkeleton && <GlobalSkeletonLoader />}
      {children}
    </>
  );
}

export function GlobalSkeletonLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
      <div className="w-full max-w-2xl p-6 space-y-6">
        {/* Card skeleton */}
        <Skeleton className="h-32 w-full rounded-2xl shimmer" />
        {/* List item skeletons */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-2/3 rounded shimmer" />
          <Skeleton className="h-6 w-1/2 rounded shimmer" />
          <Skeleton className="h-6 w-3/4 rounded shimmer" />
        </div>
        {/* Text block skeletons */}
        <Skeleton className="h-4 w-full rounded shimmer" />
        <Skeleton className="h-4 w-5/6 rounded shimmer" />
        <Skeleton className="h-4 w-2/3 rounded shimmer" />
      </div>
    </div>
  );
}

// Add this to your global CSS (globals.css):
// .shimmer {
//   position: relative;
//   overflow: hidden;
// }
// .shimmer::after {
//   content: "";
//   position: absolute;
//   top: 0; left: 0; height: 100%; width: 100%;
//   background: linear-gradient(90deg, transparent, rgba(0,172,193,0.15), transparent);
//   animation: shimmer 1.5s infinite;
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
