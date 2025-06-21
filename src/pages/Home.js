import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PostList from "../components/PostList";
export const Home = () => {
    return (_jsxs("div", { className: "pt-24 px-4 min-h-screen bg-black text-white", children: [_jsx("h2", { className: "text-3xl font-bold mb-6 text-fuchsia-500 text-center", children: "Recent Posts" }), _jsx(PostList, {})] }));
};
