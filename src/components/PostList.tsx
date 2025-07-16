import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import type { ReactNode } from "react";
import { JSX } from "react";

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author_email?: string;
    author_name?: string;
    author_avatar_url?: string;
}

interface Props {
    post: Post;
}

const PostItem = ({ post }: Props): JSX.Element => {
    const parsedDate = parseISO(post.created_at);
    const isParsedValid = isValid(parsedDate);
    const showTime = isParsedValid
        ? formatDistanceToNow(parsedDate, { addSuffix: true })
        : "Unknown time";

    return (
        <article className="bg-[#1c1c1c] p-4 rounded-xl text-white shadow hover:shadow-lg transition space-y-2">
            <Link
                to={`/post/${post.id}`}
                className="block hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded"
                aria-label={`View post titled ${post.title}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold text-white">
                        {post.author_name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{post.author_name}</p>
                    </div>
                </div>

                <h2 className="font-bold text-lg">{post.title}</h2>
                <p className="text-gray-300">{post.content}</p>

                {/* ✅ Clean timestamp */}
                <p className="text-xs text-gray-400 mt-2">{showTime}</p>
            </Link>
        </article>
    );
};

export default PostItem;

