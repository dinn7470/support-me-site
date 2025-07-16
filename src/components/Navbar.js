import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/RealAuthContext";
import { ThemeToggle } from './ThemeToggle';
export const Navbar = ({ storiesLink = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const location = useLocation();
    const displayName = user?.user_metadata?.user_name || user?.email;
    const linkClass = (path) => {
        const isActive = path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);
        return `transition-colors font-medium text-sm ${isActive ? "text-primary" : "text-muted hover:text-accent"}`;
    };
    return (_jsx("nav", { className: "fixed top-0 w-full z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow", children: _jsx("div", { className: "max-w-6xl mx-auto px-4", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs(Link, { to: "/", className: "font-bold text-xl text-accent dark:text-white", children: ["Support", _jsx("span", { className: "text-primary", children: "Me" })] }), _jsxs("div", { className: "hidden md:flex items-center space-x-6", children: [_jsx(Link, { to: "/", className: linkClass("/"), children: "Home" }), _jsx(Link, { to: "/communities", className: linkClass("/communities"), children: "Communities" }), _jsx(Link, { to: "/stories", className: linkClass("/stories"), children: "Stories" }), _jsx(Link, { to: "/devices", className: linkClass("/devices"), children: "Devices" }), storiesLink && (_jsx(Link, { to: "/stories/create", className: linkClass("/stories/create"), children: "Request Help" })), _jsx(Link, { to: "/plans", className: linkClass("/plans"), children: "Plans" }), _jsx(Link, { to: "/about", className: linkClass("/about"), children: "About" })] }), _jsxs("div", { className: "hidden md:flex items-center gap-4", children: [user ? (_jsxs("div", { className: "flex items-center gap-3", children: [user.user_metadata?.avatar_url && (_jsx("img", { src: user.user_metadata.avatar_url, alt: "User Avatar", className: "w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-white" })), _jsx("span", { className: "text-sm text-accent dark:text-white whitespace-nowrap", children: displayName }), _jsx("button", { onClick: signOut, className: "text-red-500 hover:underline text-sm", children: "Sign Out" })] })) : (_jsx(Link, { to: "/auth", className: "px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition", children: "Sign In" })), _jsx(ThemeToggle, {})] })] }) }) }));
};
