"use client";

import { useTheme } from "next-themes";

import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ThemeSelect = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const currentTheme = theme === "system" ? "System" : theme === "light" ? "Light" : "Dark";

  return (
    <Item variant="outline" className="w-full">
      <ItemContent>
        <ItemHeader className="font-medium">Appearance</ItemHeader>
        <ItemDescription>Select the theme you want to use for the dashboard.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Select onValueChange={handleThemeChange} value={theme}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={currentTheme} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </ItemActions>
    </Item>
  );
};

export default ThemeSelect;
