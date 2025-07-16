import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { theme } from "../theme";
import toast from "react-hot-toast";

const StoriesHelpCreatePostPage = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [goal, setGoal] = useState<number | "">("");
    const [thankYouMessage, setThankYouMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error("You must be logged in to post");
            return;
        }

        const { error } = await supabase.from("posts").insert([
            {
                title,
                content,
                goal_amount: goal,
                author_name: user.email,
                user_id: user.id,
                type: "help",
                thank_you_message: thankYouMessage, // ✅ included here
            },
        ]);

        if (error) {
            console.error("Post insert error:", error);
            toast.error("Failed to post story");
            return;
        }

        toast.success("Story posted!");
        navigate("/stories");
    };

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-lg mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-center text-primary">Share Your Story</h1>
                <form onSubmit={handleSubmit} className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-4`}>
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Goal Amount ($)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                            value={goal}
                            onChange={(e) =>
                                setGoal(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Thank You Message (shown after donation)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                            value={thankYouMessage}
                            onChange={(e) => setThankYouMessage(e.target.value)}
                            placeholder="Thank you for supporting my story!"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                    >
                        Post Story
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StoriesHelpCreatePostPage;

