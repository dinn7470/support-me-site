import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { PostDetail } from './PostDetail';
const PostDetailWrapper = () => {
    const { id } = useParams();
    const postId = parseInt(id || "", 10);
    if (isNaN(postId)) {
        return _jsx("div", { className: "text-red-500", children: "Invalid post ID" });
    }
    return _jsx(PostDetail, { postId: postId });
};
export default PostDetailWrapper;
