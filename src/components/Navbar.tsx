import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/RealAuthContext";
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
    storiesLink?: boolean;
}

export const Navbar = ({ storiesLink = false }: NavbarProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const location = useLocation();

    const displayName = user?.user_metadata?.user_name || user?.email;

    const linkClass = (path: string) => {
        const isActive = path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);

        return `transition-colors font-medium text-sm ${
            isActive ? "text-primary" : "text-muted hover:text-accent"
        }`;
    };

    return (
        <nav className="fixed top-0 w-full z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="font-bold text-xl text-accent dark:text-white">
                        Support<span className="text-primary">Me</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={linkClass("/")}>Home</Link>
                        <Link to="/communities" className={linkClass("/communities")}>Communities</Link>
                        <Link to="/stories" className={linkClass("/stories")}>Stories</Link>
                        <Link to="/devices" className={linkClass("/devices")}>Devices</Link>
                        {storiesLink && (
                            <Link to="/stories/create" className={linkClass("/stories/create")}>Request Help</Link>
                        )}
                        <Link to="/plans" className={linkClass("/plans")}>Plans</Link>
                        <Link to="/about" className={linkClass("/about")}>About</Link>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-white"
                                    />
                                )}
                                <span className="text-sm text-accent dark:text-white whitespace-nowrap">
                                    {displayName}
                                </span>
                                <button
                                    onClick={signOut}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
                            >
                                Sign In
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};
