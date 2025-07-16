import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";
const PostPage = () => {
    const { id } = useParams();
    console.log("📦 useParams id:", id); // ✅ log route param
    if (!id || isNaN(Number(id))) {
        return _jsx("div", { className: "text-red-500 text-center mt-20", children: "Invalid post ID." });
    }
    return (_jsx("div", { className: "pt-20", children: _jsx(PostDetail, { postId: Number(id) }) }));
};
export default PostPage;
