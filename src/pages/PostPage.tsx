import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";

const PostPage = () => {
    const { id } = useParams<{ id: string }>();

    console.log("📦 useParams id:", id); // ✅ log route param

    if (!id || isNaN(Number(id))) {
        return <div className="text-red-500 text-center mt-20">Invalid post ID.</div>;
    }

    return (
        <div className="pt-20">
            <PostDetail postId={Number(id)} />
        </div>
    );
};

export default PostPage;

