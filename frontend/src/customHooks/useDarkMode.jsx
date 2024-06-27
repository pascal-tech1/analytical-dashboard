import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  useEffect(() => {
    const handleMediaQueryChange = () => {
      setPrefersDarkMode(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return prefersDarkMode;
};

export default useDarkMode;
