import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
    title: string;
    content: string;
    author_email?: string;
    author_name?: string;
    author_avatar_url?: string;
}

const createPost = async (post: PostInput) => {
    const { data, error } = await supabase.from("Posts").insert(post);
    if (error) throw new Error(error.message);
    return data;
};

export const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user } = useAuth();

    const { mutate } = useMutation({ mutationFn: createPost });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) return;

        mutate({
            title,
            content,
            author_email: user.email,
            author_name: user.user_metadata?.full_name || user.email,
            author_avatar_url: user.user_metadata?.picture || "",
        });

        setTitle("");
        setContent("");
    };

    return (
        <div className="pt-24 px-4 min-h-screen bg-black text-white">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 text-fuchsia-500">
                    Create New Post
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-black space-y-6 border border-gray-800 p-6 rounded-lg"
                >
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:border-fuchsia-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={6}
                            className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded resize-none focus:outline-none focus:border-fuchsia-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-6 py-2 rounded transition"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
};
