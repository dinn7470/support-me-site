import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem"; // ✅ Placeholder or actual component
// ✅ Fetch posts from Supabase
const fetchPosts = async () => {
    const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .order("created_at", { ascending: false });
    if (error)
        throw new Error(error.message);
    return data || [];
};
// ✅ PostList component
const PostList = () => {
    const { data: posts, error, isLoading, } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });
    if (isLoading) {
        return _jsx("div", { className: "text-white mt-24 text-center", children: "Loading posts..." });
    }
    if (error) {
        return _jsxs("div", { className: "text-red-500 mt-24 text-center", children: ["Error: ", error.message] });
    }
    return (_jsx("div", { className: "pt-24 px-4 bg-black text-white min-h-screen", children: _jsx("div", { className: "max-w-2xl mx-auto space-y-6", children: posts?.map((post) => (_jsx(PostItem, { post: post }, post.id))) }) }));
};
export default PostList;
