import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// vite-project/src/pages/CreatePostPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
import toast from "react-hot-toast";
const CreatePostPage = () => {
    const { id: communityId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!communityId) {
            toast.error("Invalid community ID");
            navigate("/");
        }
    }, [communityId, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error("All fields are required");
            return;
        }
        if (!communityId) {
            toast.error("Community ID is missing");
            return;
        }
        setLoading(true);
        const { data: { user }, error: authError, } = await supabase.auth.getUser();
        if (authError || !user?.id) {
            toast.error("You must be logged in to post.");
            setLoading(false);
            return;
        }
        const metadata = user.user_metadata ?? {};
        const username = metadata.user_name?.trim() || "unknown";
        const firstName = metadata.first_name?.trim() || "";
        const lastName = metadata.last_name?.trim() || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const postPayload = {
            title: title.trim(),
            content: content.trim(),
            community_id: communityId,
            user_id: user.id,
            post_date: new Date().toISOString(),
            type: "community",
        };
        const { data: insertedPost, error: insertError } = await supabase
            .from("posts")
            .insert([postPayload])
            .select()
            .maybeSingle();
        if (insertError) {
            toast.error("Insert failed: " + insertError.message);
            setLoading(false);
            return;
        }
        toast.success("Post created!");
        navigate(`/community/${communityId}`);
        setLoading(false);
    };
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-xl mx-auto space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-primary", children: "Create a Post" }), _jsxs("form", { onSubmit: handleSubmit, className: `${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-4`, children: [_jsx("label", { className: "block text-sm font-medium", children: "Title" }), _jsx("input", { type: "text", required: true, className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: title, onChange: (e) => setTitle(e.target.value) }), _jsx("label", { className: "block text-sm font-medium", children: "Content" }), _jsx("textarea", { required: true, rows: 6, className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: content, onChange: (e) => setContent(e.target.value) }), _jsx("button", { type: "submit", disabled: loading, className: "bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full", children: loading ? "Posting..." : "Post" })] })] }) }));
};
export default CreatePostPage;
