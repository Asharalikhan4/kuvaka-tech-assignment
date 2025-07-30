"use client";
import React from "react";
import { clsx } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { useThemeStore } from "@/app/store/themeStore";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { isDark } = useThemeStore();

    // Classes based on variant + isDark
    const getVariantClasses = () => {
      switch (variant) {
        case "destructive":
          return isDark
            ? "bg-red-900 text-slate-50 hover:bg-red-900/90"
            : "bg-red-500 text-slate-50 hover:bg-red-500/90";
        case "outline":
          return isDark
            ? "border border-slate-800 bg-slate-950 text-slate-50 hover:bg-slate-800"
            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100";
        case "secondary":
          return isDark
            ? "bg-slate-800 text-slate-50 hover:bg-slate-800/80"
            : "bg-slate-100 text-slate-900 hover:bg-slate-100/80";
        case "ghost":
          return isDark
            ? "hover:bg-slate-800 hover:text-slate-50"
            : "hover:bg-slate-100 hover:text-slate-900";
        case "link":
          return isDark
            ? "text-slate-50 underline-offset-4 hover:underline"
            : "text-slate-900 underline-offset-4 hover:underline";
        default:
          return isDark
            ? "bg-slate-50 text-slate-900 hover:bg-slate-50/90"
            : "bg-slate-900 text-slate-50 hover:bg-slate-900/90";
      }
    };

    return (
      <button
        className={clsx(
          buttonVariants({ variant, size }),
          getVariantClasses(),
          isDark
            ? "ring-offset-slate-950 focus-visible:ring-slate-300 cursor-pointer"
            : "ring-offset-white focus-visible:ring-slate-950 cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
