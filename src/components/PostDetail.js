import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '../supabase-client';
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
const fetchPostById = async (id) => {
    const { data, error } = await supabase
        .from("posts") // ✅ correct case
        .select("*")
        .eq("id", id)
        .single();
    if (error)
        throw new Error(error.message);
    if (!data)
        throw new Error("Post not found");
    return data;
};
export const PostDetail = ({ postId }) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostById(postId),
    });
    if (isLoading)
        return _jsx("div", { children: "Loading post..." });
    if (error)
        return _jsxs("div", { children: ["Error: ", error.message] });
    if (!data)
        return _jsx("div", { children: "Post not found." });
    const parsedDate = parseISO(data.created_at);
    const displayTime = isValid(parsedDate)
        ? formatDistanceToNow(parsedDate, { addSuffix: true })
        : "Unknown time";
    return (_jsxs("div", { className: "bg-[#1c1c1c] text-white max-w-2xl mx-auto mt-20 p-6 rounded-xl shadow-lg space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg", children: data.author_name?.charAt(0) || "U" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: data.author_name || "Unknown" }), _jsx("p", { className: "text-xs text-gray-400", children: displayTime })] })] }), _jsx("h1", { className: "text-2xl font-bold", children: data.title }), _jsx("p", { className: "text-gray-300 whitespace-pre-line", children: data.content })] }));
};
