"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const GuideThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="guide-theme-toggle" aria-hidden>
        <span className="guide-theme-toggle-label">Theme</span>
      </div>
    );
  }

  const currentTheme = theme ?? "system";
  const ThemeIcon = currentTheme === "dark" ? Moon : currentTheme === "light" ? Sun : Monitor;

  return (
    <Select value={currentTheme} onValueChange={(v) => setTheme(v)}>
      <SelectTrigger className="guide-theme-trigger" aria-label="Change theme">
        <SelectValue placeholder="Theme">
          <ThemeIcon className="guide-theme-icon" aria-hidden />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="guide-theme-content" position="popper" sideOffset={6}>
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <SelectItem key={opt.value} value={opt.value} className="guide-theme-option">
              <Icon className="guide-theme-option-icon" aria-hidden />
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export { GuideThemeToggle };
