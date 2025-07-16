import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { theme } from "../theme";
const AuthPage = () => {
    return (_jsx("div", { className: `min-h-screen flex items-center justify-center ${theme.bg.page} text-accent dark:text-white px-4`, children: _jsxs("div", { className: `w-full max-w-2xl space-y-8 p-10 ${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} border border-gray-200 dark:border-zinc-700`, children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-primary", children: "Welcome to SupportMe" }), _jsx("p", { className: "text-sm mt-2 text-muted", children: "Sign in or create an account to get started." })] }), _jsxs("div", { className: "flex flex-col space-y-4", children: [_jsx(Link, { to: "/signin", className: "w-full py-2 px-4 bg-white text-gray-800 text-center font-medium text-sm rounded-md hover:bg-gray-100 transition dark:bg-zinc-200", children: "Sign In" }), _jsx(Link, { to: "/signup", className: "w-full py-2 px-4 bg-primary text-white text-center font-medium text-sm rounded-md hover:bg-blue-700 transition", children: "Create Account" })] })] }) }));
};
export default AuthPage;
