import { Link } from "react-router-dom";
import { Post } from "./PostList";

interface Props {
    post: Post;
}

const PostItem = ({ post }: Props) => {
    return (
        <div className="relative group">
        
            {/* Clickable post container */}
            <Link to={`/post/${post.id}`} className="block relative z-10">
                <div className="w-full md:w-80 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">

                    {/* Avatar and Title */}
                    <div className="flex items-center space-x-3 mb-2">
                        {post.author_avatar_url ? (
                            <img
                                src={post.author_avatar_url}
                                alt="User Avatar"
                                className="w-[35px] h-[35px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-purple-700 to-purple-900 flex items-center justify-center text-sm font-bold">
                                {post.author_name?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                        <div className="text-sm text-gray-400">{post.author_name || post.author_email || "Anonymous"}</div>
                    </div>

                    {/* Title */}
                    <div className="text-[18px] font-semibold mb-2">{post.title}</div>

                    {/* Content preview */}
                    <p className="text-sm text-gray-300 line-clamp-3">{post.content}</p>
                </div>
            </Link>
        </div>
    );
};

export default PostItem;
