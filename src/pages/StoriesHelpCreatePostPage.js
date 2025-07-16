import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [goal, setGoal] = useState("");
    const [thankYouMessage, setThankYouMessage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
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
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-lg mx-auto space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-primary", children: "Share Your Story" }), _jsxs("form", { onSubmit: handleSubmit, className: `${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-4`, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Title" }), _jsx("input", { className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: title, onChange: (e) => setTitle(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Content" }), _jsx("textarea", { className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: content, onChange: (e) => setContent(e.target.value), rows: 5, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Goal Amount ($)" }), _jsx("input", { type: "number", className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: goal, onChange: (e) => setGoal(e.target.value === "" ? "" : Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: "Thank You Message (shown after donation)" }), _jsx("input", { type: "text", className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white", value: thankYouMessage, onChange: (e) => setThankYouMessage(e.target.value), placeholder: "Thank you for supporting my story!" })] }), _jsx("button", { type: "submit", className: "bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full", children: "Post Story" })] })] }) }));
};
export default StoriesHelpCreatePostPage;
