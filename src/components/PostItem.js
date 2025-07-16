import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
const PostItem = ({ post }) => {
    const parsedDate = parseISO(post.created_at);
    const isParsedValid = isValid(parsedDate);
    const showTime = isParsedValid
        ? formatDistanceToNow(parsedDate, { addSuffix: true })
        : "Unknown time";
    return (_jsx("article", { className: "bg-surface p-4 rounded-xl text-accent dark:bg-zinc-900 dark:text-white shadow-card transition space-y-2", children: _jsxs(Link, { to: `/post/${post.id}`, className: "block hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary rounded", "aria-label": `View post titled ${post.title}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold", children: post.author_name?.charAt(0) || "U" }), _jsx("p", { className: "font-medium text-sm", children: post.author_name })] }), _jsx("h2", { className: "font-semibold text-lg", children: post.title }), _jsx("p", { className: "text-muted dark:text-gray-300", children: post.content }), _jsx("p", { className: "text-xs text-muted mt-2", children: showTime })] }) }));
};
export default PostItem;
