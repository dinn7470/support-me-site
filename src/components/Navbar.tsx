import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Corrected import
import { useAuth } from "../context/AuthContext.tsx";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signInWithGoogle, signOut, user } = useAuth();

    const displayName = user?.user_metadata.user_name || user?.email;

    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="font-mono text-xl font-bold text-white">
                        Support<span className="text-purple-500">Me</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/create" className="text-gray-300 hover:text-white transition-colors">
                            Create Post
                        </Link>
                        <Link to="/communities" className="text-gray-300 hover:text-white transition-colors">
                            Communities
                        </Link>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-white"
                                    />
                                )}
                                <span className="text-white font-medium text-sm whitespace-nowrap">{displayName}</span>
                                <button
                                    onClick={signOut}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={signInWithGoogle}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-800 text-sm font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                Sign in with Google
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="text-gray-300 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[rgba(10,10,10,0.9)] px-4 pt-4 pb-6 space-y-4">
                    <Link to="/" className="block text-gray-300 hover:text-white">
                        Home
                    </Link>
                    <Link to="/create" className="block text-gray-300 hover:text-white">
                        Create Post
                    </Link>
                    <Link to="/communities" className="block text-gray-300 hover:text-white">
                        Communities
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3 mt-4">
                            {user.user_metadata?.avatar_url && (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-white"
                                />
                            )}
                            <span className="text-white text-sm">{displayName}</span>
                            <button
                                onClick={signOut}
                                className="px-4 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={signInWithGoogle}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Sign in with Google
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};
