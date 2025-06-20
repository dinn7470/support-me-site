import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem"; // ✅ Placeholder or actual component

// ✅ Shared post interface
export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author_email?: string;
    author_name?: string;
    author_avatar_url?: string;
}

// ✅ Fetch posts from Supabase
const fetchPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
};

// ✅ PostList component
const PostList = () => {
    const {
        data: posts,
        error,
        isLoading,
    } = useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    if (isLoading) {
        return <div className="text-white mt-24 text-center">Loading posts...</div>;
    }

    if (error) {
        return <div className="text-red-500 mt-24 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="pt-24 px-4 bg-black text-white min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
                {posts?.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostList;
