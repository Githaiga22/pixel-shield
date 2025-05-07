import { cn } from "@/lib/utils";

interface LoadingCircleProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingCircle({ progress, size = "md", className }: LoadingCircleProps) {
  const sizeClasses = {
    sm: "h-24 w-24",
    md: "h-32 w-32",
    lg: "h-40 w-40",
  };
  
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle 
          className="progress-circle"
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-semibold text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
