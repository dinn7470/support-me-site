import { useQuery } from "@tanstack/react-query";
import { supabase } from '../supabase-client';
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author_email?: string;
    author_name?: string;
    author_avatar_url?: string;
}

interface Props {
    postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
    const { data, error } = await supabase
        .from("posts") // ✅ correct case
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Post not found");

    return data;
};

export const PostDetail = ({ postId }: Props) => {
    const { data, error, isLoading } = useQuery<Post, Error>({
        queryKey: ["post", postId],
        queryFn: () => fetchPostById(postId),
    });

    if (isLoading) return <div>Loading post...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>Post not found.</div>;

    const parsedDate = parseISO(data.created_at);
    const displayTime = isValid(parsedDate)
        ? formatDistanceToNow(parsedDate, { addSuffix: true })
        : "Unknown time";

    return (
        <div className="bg-[#1c1c1c] text-white max-w-2xl mx-auto mt-20 p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {data.author_name?.charAt(0) || "U"}
                </div>
                <div>
                    <p className="font-medium text-sm">{data.author_name || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{displayTime}</p>
                </div>
            </div>

            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p className="text-gray-300 whitespace-pre-line">{data.content}</p>
        </div>
    );
};

