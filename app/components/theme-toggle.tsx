"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_COOKIE = "dadg-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  localStorage.setItem(THEME_COOKIE, theme);
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const cookieTheme = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${THEME_COOKIE}=`))
      ?.split("=")[1] as Theme | undefined;
    const storageTheme = localStorage.getItem(THEME_COOKIE) as Theme | null;
    const initialTheme =
      cookieTheme || storageTheme || (root.classList.contains("dark") ? "dark" : "light");

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
        "border-[rgba(9,66,125,0.12)] bg-white text-slate-950 hover:text-black",
        "dark:border-white/15 dark:bg-white dark:text-black dark:hover:text-black"
      )}
    >
      {mounted && theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{mounted && theme === "dark" ? "Claro" : "Escuro"}</span>
    </button>
  );
}
