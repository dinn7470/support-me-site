import { jsx as _jsx } from "react/jsx-runtime";
export const Layout = ({ children }) => {
    return (_jsx("div", { className: "min-h-screen bg-black text-white pt-20 px-4", children: _jsx("div", { className: "max-w-5xl mx-auto", children: children }) }));
};
