"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useThemeStore } from "@/app/store/themeStore";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const { isDark } = useThemeStore();

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={clsx(
        "animate-spin",
        sizeClasses[size],
        isDark ? "text-slate-300" : "text-slate-700",
        className
      )}
    />
  );
}
