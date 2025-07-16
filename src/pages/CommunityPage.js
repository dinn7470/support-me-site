import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
import toast from "react-hot-toast";
const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";
const CommunityPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [memberCount, setMemberCount] = useState(0);
    const checkMembership = useCallback(async (email) => {
        if (!email || !id)
            return;
        const { data: membership, error } = await supabase
            .from("community_members")
            .select("*")
            .eq("user_email", email)
            .eq("community_id", id);
        if (error)
            console.error("Membership check error:", error);
        setIsMember((membership?.length ?? 0) > 0);
    }, [id]);
    const fetchMemberCount = useCallback(async () => {
        if (!id)
            return;
        const { count, error } = await supabase
            .from("community_members")
            .select("*", { count: "exact", head: true })
            .eq("community_id", id);
        if (error)
            console.error("Fetch member count error:", error);
        setMemberCount(count || 0);
    }, [id]);
    useEffect(() => {
        if (!id)
            return;
        const load = async () => {
            const { data: communityData } = await supabase
                .from("communities")
                .select("*")
                .eq("id", id)
                .single();
            if (communityData)
                setCommunity(communityData);
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
            const enriched = (postsRaw ?? []).map(post => {
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
            if (!user?.id)
                return;
            setUserId(user.id);
            setUserEmail(user.email || null);
            if (user.email)
                await checkMembership(user.email);
        };
        if (id) {
            void initUser();
            void fetchMemberCount();
        }
    }, [id, checkMembership, fetchMemberCount]);
    const joinCommunity = async () => {
        if (!userEmail || !id)
            return;
        const { error } = await supabase.from("community_members")
            .insert({ user_email: userEmail, community_id: id });
        if (error) {
            console.error("Join error:", error);
            toast.error("Failed to join");
        }
        else {
            toast.success("Joined community");
            setIsMember(true);
            await fetchMemberCount();
        }
    };
    const leaveCommunity = async () => {
        if (!userEmail || !id)
            return;
        const { error } = await supabase.from("community_members")
            .delete()
            .eq("user_email", userEmail)
            .eq("community_id", id);
        if (error) {
            console.error("Leave error:", error);
            toast.error("Failed to leave");
        }
        else {
            toast.success("Left community");
            setIsMember(false);
            await fetchMemberCount();
        }
    };
    const handleDelete = async (postId) => {
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (error) {
            toast.error("Delete failed: " + error.message);
            console.error("Delete error:", error);
        }
        else {
            toast.success("Post deleted.");
            setPosts(prev => prev.filter(post => post.id !== postId));
        }
    };
    if (!id || !community)
        return null;
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: `${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} overflow-hidden`, children: [_jsx("img", { src: String(community.banner_url), alt: `${community.name} banner`, className: "w-full h-48 object-cover" }), _jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-3xl font-bold text-primary", children: community.name }), _jsx("p", { className: "text-muted mt-1", children: community.description }), _jsxs("p", { className: "text-sm text-muted", children: [memberCount, " member", memberCount === 1 ? "" : "s"] }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md", children: isMember ? "You are a member" : "Not a member" }) }), _jsxs("div", { className: "mt-4 flex justify-between", children: [isMember && (_jsx("button", { onClick: () => navigate(`/community/${id}/create`), className: "bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700", children: "Create Post" })), isMember ? (_jsx("button", { onClick: leaveCommunity, className: "text-red-500", children: "Leave" })) : (_jsx("button", { onClick: joinCommunity, className: "text-blue-500", children: "Join" }))] })] })] }), posts.length > 0 ? (posts.map((post) => (_jsxs("div", { className: `${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-4`, children: [_jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("img", { src: post.author_avatar_url || DEFAULT_AVATAR_URL, alt: "User avatar", className: "w-10 h-10 rounded-full object-cover border border-gray-300", onError: (e) => {
                                        e.currentTarget.src = DEFAULT_AVATAR_URL;
                                    } }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold break-all", children: post.author_name }), _jsx("p", { className: "text-sm text-muted", children: new Date(post.created_at).toLocaleDateString() })] })] }), _jsx("h3", { className: "text-lg font-semibold break-words", children: post.title }), _jsx("p", { className: "text-muted mt-1 whitespace-pre-wrap break-words", children: post.content }), userId === post.author_id && (_jsxs("div", { className: "mt-4 flex gap-4 text-sm text-blue-500", children: [_jsx("button", { className: "hover:underline", children: "Comment" }), _jsx("button", { className: "hover:underline", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(post.id), className: "hover:underline text-red-500", children: "Delete" })] }))] }, post.id)))) : (_jsx("p", { className: "text-center text-muted", children: "No posts yet." }))] }) }));
};
export default CommunityPage;
