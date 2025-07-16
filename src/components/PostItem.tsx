import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import type { JSX } from "react";

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author_name?: string;
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
        <article className="bg-surface p-4 rounded-xl text-accent dark:bg-zinc-900 dark:text-white shadow-card transition space-y-2">
            <Link
                to={`/post/${post.id}`}
                className="block hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                aria-label={`View post titled ${post.title}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {post.author_name?.charAt(0) || "U"}
                    </div>
                    <p className="font-medium text-sm">{post.author_name}</p>
                </div>
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-muted dark:text-gray-300">{post.content}</p>
                <p className="text-xs text-muted mt-2">{showTime}</p>
            </Link>
        </article>
    );
};

export default PostItem;

