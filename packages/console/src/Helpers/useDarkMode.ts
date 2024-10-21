import { useState } from "react";

/**
 * Custom hook implementing dark mode.
 */
const useDarkMode = () => {
  const [theme, setTheme] = useState(() => "light");

  /**
   */
  const setMode = (mode: string) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  /**
   */
  const themeToggler = () => {
    if (theme === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return [theme, themeToggler];
};

export default useDarkMode;
