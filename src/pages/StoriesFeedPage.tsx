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

interface HelpPost {
    id: number;
    title: string;
    content: string;
    created_at: string;
    goal_amount?: number;
    user_id: string;
    author_name?: string;
    avatar_url?: string;
    full_name?: string;
}

const StoriesFeedPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState<HelpPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void fetchHelpPosts(1);
    }, []);

    const fetchHelpPosts = async (pageNumber: number) => {
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

        const enriched = (data ?? []).map((post: any) => {
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

    const handleDonate = (id: number) => navigate(`/stories/${id}/donate`);

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) {
            console.error("Delete error:", error);
            return;
        }
        setPosts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-center text-primary">Recent Stories</h1>
                <p className="text-center text-muted mb-4">
                    These stories come from people seeking help. You can support them directly.
                </p>
                <div className="text-center">
                    <button
                        onClick={() => navigate("/stories/create")}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Share Your Story
                    </button>
                </div>

                {loading && <p className="text-center text-muted">Loading stories...</p>}

                {!loading && posts.length === 0 && (
                    <p className="text-center text-muted">No stories available yet.</p>
                )}

                {posts.map((post) => {
                    const time = isValid(parseISO(post.created_at))
                        ? formatDistanceToNow(parseISO(post.created_at), { addSuffix: true })
                        : "Unknown";

                    return (
                        <div key={post.id} className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-4`}>
                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src={post.avatar_url}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    onError={(e) => {
                                        e.currentTarget.src = DEFAULT_AVATAR_URL;
                                    }}
                                />
                                <div>
                                    <p className="text-sm font-medium">{post.full_name}</p>
                                    <p className="text-xs text-muted">{time}</p>
                                </div>
                            </div>
                            <h2 className="text-lg font-semibold">{post.title}</h2>
                            <p className="text-muted dark:text-gray-300">{post.content}</p>
                            {post.goal_amount && (
                                <p className="text-sm text-primary mt-1">
                                    Goal: ${post.goal_amount.toFixed(2)}
                                </p>
                            )}
                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => handleDonate(post.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Help {post.full_name?.split(" ")[0] || "them"}
                                </button>

                                {user?.id === post.user_id && (
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {hasMore && !loading && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => fetchHelpPosts(page + 1)}
                            className="bg-muted text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoriesFeedPage;
