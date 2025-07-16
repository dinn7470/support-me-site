import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/StoriesFeedPage.tsx
// src/pages/StoriesFeedPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { theme } from "../theme";
import { useAuth } from "../context/RealAuthContext";
const PAGE_SIZE = 10;
const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";
const StoriesFeedPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        void fetchHelpPosts(1);
    }, []);
    const fetchHelpPosts = async (pageNumber) => {
        const from = (pageNumber - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await supabase
            .from("posts")
            .select(`
                id, title, content, created_at, goal_amount, user_id,
                profiles:profiles!posts_user_id_fkey(
                    user_name, first_name, last_name, avatar_url
                )
            `)
            .eq("type", "help")
            .order("created_at", { ascending: false })
            .range(from, to);
        if (error) {
            console.error("Fetch error:", error);
            setLoading(false);
            return;
        }
        const enriched = (data ?? []).map((post) => {
            const profile = post.profiles || {};
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                created_at: post.created_at,
                goal_amount: post.goal_amount,
                user_id: post.user_id,
                avatar_url: profile.avatar_url || DEFAULT_AVATAR_URL,
                full_name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.user_name || "Unknown",
                author_name: profile.user_name || "Unknown",
            };
        });
        setPosts(pageNumber === 1 ? enriched : [...posts, ...enriched]);
        setHasMore((data?.length || 0) === PAGE_SIZE);
        setPage(pageNumber);
        setLoading(false);
    };
    const handleDonate = (id) => navigate(`/stories/${id}/donate`);
    const handleDelete = async (id) => {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) {
            console.error("Delete error:", error);
            return;
        }
        setPosts((prev) => prev.filter((p) => p.id !== id));
    };
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsx("h1", { className: "text-4xl font-bold text-center text-primary", children: "Recent Stories" }), _jsx("p", { className: "text-center text-muted mb-4", children: "These stories come from people seeking help. You can support them directly." }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: () => navigate("/stories/create"), className: "bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700", children: "Share Your Story" }) }), loading && _jsx("p", { className: "text-center text-muted", children: "Loading stories..." }), !loading && posts.length === 0 && (_jsx("p", { className: "text-center text-muted", children: "No stories available yet." })), posts.map((post) => {
                    const time = isValid(parseISO(post.created_at))
                        ? formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })
                        : "Unknown";
                    return (_jsxs("div", { className: `${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-4`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("img", { src: post.avatar_url, alt: "avatar", className: "w-10 h-10 rounded-full object-cover border border-gray-300", onError: (e) => {
                                            e.currentTarget.src = DEFAULT_AVATAR_URL;
                                        } }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: post.full_name }), _jsx("p", { className: "text-xs text-muted", children: time })] })] }), _jsx("h2", { className: "text-lg font-semibold", children: post.title }), _jsx("p", { className: "text-muted dark:text-gray-300", children: post.content }), post.goal_amount && (_jsxs("p", { className: "text-sm text-primary mt-1", children: ["Goal: $", post.goal_amount.toFixed(2)] })), _jsxs("div", { className: "flex justify-between mt-3", children: [_jsxs("button", { onClick: () => handleDonate(post.id), className: "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700", children: ["Help ", post.full_name?.split(" ")[0] || "them"] }), user?.id === post.user_id && (_jsx("button", { onClick: () => handleDelete(post.id), className: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700", children: "Delete" }))] })] }, post.id));
                }), hasMore && !loading && (_jsx("div", { className: "text-center mt-6", children: _jsx("button", { onClick: () => fetchHelpPosts(page + 1), className: "bg-muted text-white px-4 py-2 rounded hover:bg-gray-600", children: "Load More" }) }))] }) }));
};
export default StoriesFeedPage;
