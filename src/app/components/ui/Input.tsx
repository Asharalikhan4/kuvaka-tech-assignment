"use client";
import React from "react";
import { clsx } from "clsx";
import { useThemeStore } from "@/app/store/themeStore";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { isDark } = useThemeStore();

    return (
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          isDark
            ? "border-slate-800 bg-slate-950 text-slate-100 ring-offset-slate-950 placeholder:text-slate-400 focus-visible:ring-slate-300"
            : "border-slate-200 bg-white text-slate-900 ring-offset-white placeholder:text-slate-500 focus-visible:ring-slate-950",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
