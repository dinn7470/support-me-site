import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
const PostItem = ({ post }) => {
    const parsedDate = parseISO(post.created_at);
    const isParsedValid = isValid(parsedDate);
    const showTime = isParsedValid
        ? formatDistanceToNow(parsedDate, { addSuffix: true })
        : "Unknown time";
    return (_jsx("article", { className: "bg-[#1c1c1c] p-4 rounded-xl text-white shadow hover:shadow-lg transition space-y-2", children: _jsxs(Link, { to: `/post/${post.id}`, className: "block hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded", "aria-label": `View post titled ${post.title}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold text-white", children: post.author_name?.charAt(0) || "U" }), _jsx("div", { children: _jsx("p", { className: "font-medium text-sm", children: post.author_name }) })] }), _jsx("h2", { className: "font-bold text-lg", children: post.title }), _jsx("p", { className: "text-gray-300", children: post.content }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: showTime })] }) }));
};
export default PostItem;
