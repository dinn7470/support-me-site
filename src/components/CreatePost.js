import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase-client";
import toast from "react-hot-toast";
import { theme } from "../theme";
const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";
const CreatePost = () => {
    const { id: communityId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error("All fields are required");
            return;
        }
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getUser();
        const user = sessionData?.user;
        if (!user || !communityId) {
            toast.error("Missing user or community context");
            setLoading(false);
            return;
        }
        const metadata = user.user_metadata ?? {};
        const username = metadata.user_name?.trim() || "unknown";
        const avatar_url = metadata.avatar_url;
        const author_avatar_url = avatar_url && avatar_url.startsWith("http")
            ? avatar_url
            : DEFAULT_AVATAR_URL;
        const firstName = metadata.first_name?.trim() || "";
        const lastName = metadata.last_name?.trim() || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const { error } = await supabase.from("posts").insert({
            title: title.trim(),
            content: content.trim(),
            community_id: communityId,
            user_id: user.id,
            username,
            author_name: fullName,
            author_avatar_url,
            post_date: new Date().toISOString(),
        });
        if (error) {
            toast.error(error.message);
        }
        else {
            toast.success("Post created!");
            navigate(`/community/${communityId}`);
        }
        setLoading(false);
    };
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-xl mx-auto space-y-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Create Post" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Post title", required: true, className: "w-full p-2 border rounded" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "Write something...", rows: 5, required: true, className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: loading, className: "bg-primary text-white px-4 py-2 rounded hover:bg-blue-700", children: loading ? "Posting..." : "Submit" })] })] }) }));
};
export default CreatePost;
