import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md",
        className ?? "h-4 w-full" // fallback size
      )}
      {...props}
    />
  );
}

export { Skeleton };
