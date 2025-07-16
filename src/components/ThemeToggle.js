import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
    return (_jsx("button", { onClick: () => setDarkMode(!darkMode), className: "ml-4 px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white", children: darkMode ? "🌙 Dark" : "☀️ Light" }));
};
