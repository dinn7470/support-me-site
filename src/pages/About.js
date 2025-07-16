import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/About.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
export const About = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPage = async () => {
            const { data, error } = await supabase
                .from("pages")
                .select("title, content, image_url")
                .eq("slug", "about-us")
                .maybeSingle();
            if (error) {
                console.error("❌ Fetch error:", error);
                setLoading(false);
                return;
            }
            setPage(data);
            setLoading(false);
        };
        fetchPage();
    }, []);
    if (loading)
        return _jsx("div", { className: "text-center py-10 text-white", children: "Loading..." });
    if (!page)
        return _jsx("div", { className: "text-center py-10 text-red-500", children: "Page not found." });
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 pt-28 pb-16", children: [_jsx("h1", { className: "text-5xl font-extrabold text-center text-primary mb-12", children: page.title || "About Us" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center md:items-start", children: [_jsx("div", { className: "flex-1", children: _jsx("img", { src: page.image_url, alt: "About us", className: "w-full h-auto rounded-xl shadow-xl" }) }), _jsx("div", { className: "flex-1 text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-white", children: page.content?.trim() ? (_jsx("div", { children: page.content })) : (_jsx("div", { className: "text-red-400", children: "\u26A0\uFE0F No content found in Supabase row." })) })] })] }));
};
