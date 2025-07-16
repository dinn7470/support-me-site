import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
import toast from "react-hot-toast";

interface Community {
    id: string;
    name: string;
    description: string;
    banner_url: string;
}

interface Profile {
    id: string;
    user_name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
}

interface PostWithProfile {
    id: number;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: Profile[]; // 👈 Fix: it's returned as an array
}


interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author_name: string;
    author_avatar_url: string;
    author_id: string;
}

const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";

const CommunityPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isMember, setIsMember] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [memberCount, setMemberCount] = useState<number>(0);

    const checkMembership = useCallback(async (email: string) => {
        if (!email || !id) return;
        const { data: membership, error } = await supabase
            .from("community_members")
            .select("*")
            .eq("user_email", email)
            .eq("community_id", id);

        if (error) console.error("Membership check error:", error);
        setIsMember((membership?.length ?? 0) > 0);
    }, [id]);

    const fetchMemberCount = useCallback(async () => {
        if (!id) return;
        const { count, error } = await supabase
            .from("community_members")
            .select("*", { count: "exact", head: true })
            .eq("community_id", id);

        if (error) console.error("Fetch member count error:", error);
        setMemberCount(count || 0);
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            const { data: communityData } = await supabase
                .from("communities")
                .select("*")
                .eq("id", id)
                .single();

            if (communityData) setCommunity(communityData);

            const { data: postsRaw, error: postErr } = await supabase
                .from("posts")
                .select(`
                    id, title, content, created_at, user_id,
                    profiles:profiles!posts_user_id_fkey(
                        id, user_name, first_name, last_name, avatar_url
                    )
                `)
                .eq("community_id", id)
                .order("created_at", { ascending: false });

            if (postErr) {
                console.error("Post fetch error:", postErr);
                setPosts([]);
                return;
            }

            const enriched = (postsRaw as PostWithProfile[] ?? []).map(post => {
                const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    created_at: post.created_at,
                    author_name: `${profile.user_name || "unknown"} (${profile.first_name || ""} ${profile.last_name || ""})`,
                    author_avatar_url: profile.avatar_url || DEFAULT_AVATAR_URL,
                    author_id: post.user_id,
                };
            });

            setPosts(enriched);
        };

        void load();
    }, [id]);

    useEffect(() => {
        const initUser = async () => {
            const { data: session } = await supabase.auth.getUser();
            const user = session?.user;
            if (!user?.id) return;
            setUserId(user.id);
            setUserEmail(user.email || null);
            if (user.email) await checkMembership(user.email);
        };

        if (id) {
            void initUser();
            void fetchMemberCount();
        }
    }, [id, checkMembership, fetchMemberCount]);

    const joinCommunity = async () => {
        if (!userEmail || !id) return;

        const { error } = await supabase.from("community_members")
            .insert({ user_email: userEmail, community_id: id });

        if (error) {
            console.error("Join error:", error);
            toast.error("Failed to join");
        } else {
            toast.success("Joined community");
            setIsMember(true);
            await fetchMemberCount();
        }
    };

    const leaveCommunity = async () => {
        if (!userEmail || !id) return;

        const { error } = await supabase.from("community_members")
            .delete()
            .eq("user_email", userEmail)
            .eq("community_id", id);

        if (error) {
            console.error("Leave error:", error);
            toast.error("Failed to leave");
        } else {
            toast.success("Left community");
            setIsMember(false);
            await fetchMemberCount();
        }
    };

    const handleDelete = async (postId: number) => {
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (error) {
            toast.error("Delete failed: " + error.message);
            console.error("Delete error:", error);
        } else {
            toast.success("Post deleted.");
            setPosts(prev => prev.filter(post => post.id !== postId));
        }
    };

    if (!id || !community) return null;

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} overflow-hidden`}>
                    <img
                        src={String(community.banner_url)}
                        alt={`${community.name} banner`}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h1 className="text-3xl font-bold text-primary">{community.name}</h1>
                        <p className="text-muted mt-1">{community.description}</p>
                        <p className="text-sm text-muted">{memberCount} member{memberCount === 1 ? "" : "s"}</p>
                        <div className="mt-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">
                                {isMember ? "You are a member" : "Not a member"}
                            </span>
                        </div>
                        <div className="mt-4 flex justify-between">
                            {isMember && (
                                <button
                                    onClick={() => navigate(`/community/${id}/create`)}
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Create Post
                                </button>
                            )}
                            {isMember ? (
                                <button onClick={leaveCommunity} className="text-red-500">Leave</button>
                            ) : (
                                <button onClick={joinCommunity} className="text-blue-500">Join</button>
                            )}
                        </div>
                    </div>
                </div>

                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-4`}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <img
                                    src={post.author_avatar_url || DEFAULT_AVATAR_URL}
                                    alt="User avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    onError={(e) => {
                                        e.currentTarget.src = DEFAULT_AVATAR_URL;
                                    }}
                                />
                                <div>
                                    <p className="font-semibold break-all">{post.author_name}</p>
                                    <p className="text-sm text-muted">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold break-words">{post.title}</h3>
                            <p className="text-muted mt-1 whitespace-pre-wrap break-words">{post.content}</p>
                            {userId === post.author_id && (
                                <div className="mt-4 flex gap-4 text-sm text-blue-500">
                                    <button className="hover:underline">Comment</button>
                                    <button className="hover:underline">Edit</button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="hover:underline text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;