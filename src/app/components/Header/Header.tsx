"use client";
import React from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";

export function Header() {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <header className={`border-b 
        ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo + User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
          <div>
            <h1 className={`font-semibold ${isDark ? "dark:text-slate-100" : "text-slate-900"}`}>
              Gemini AI
            </h1>
            {user && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {user.countryCode}
                {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-800" />
            )}
          </Button>

          {/* Logout */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-full"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

