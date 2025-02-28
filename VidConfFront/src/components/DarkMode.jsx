import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button onClick={toggleMode} variant="outline" size="sm">
      <Moon
        className={`h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0`}
      />
      <Sun
        className={`absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkMode;
