// vite-project/src/pages/CreatePostPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
import toast from "react-hot-toast";

const CreatePostPage = () => {
    const { id: communityId } = useParams<{ id: string }>();
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

    const handleSubmit = async (e: React.FormEvent) => {
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

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

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

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center text-primary">Create a Post</h1>
                <form
                    onSubmit={handleSubmit}
                    className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-4`}
                >
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className="block text-sm font-medium">Content</label>
                    <textarea
                        required
                        rows={6}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;