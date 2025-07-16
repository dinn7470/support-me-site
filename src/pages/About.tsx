// src/pages/About.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface PageData {
    title: string;
    content: string;
    image_url: string;
}

export const About = () => {
    const [page, setPage] = useState<PageData | null>(null);
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

    if (loading) return <div className="text-center py-10 text-white">Loading...</div>;
    if (!page) return <div className="text-center py-10 text-red-500">Page not found.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
            <h1 className="text-5xl font-extrabold text-center text-primary mb-12">
                {page.title || "About Us"}
            </h1>

            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                <div className="flex-1">
                    <img
                        src={page.image_url}
                        alt="About us"
                        className="w-full h-auto rounded-xl shadow-xl"
                    />
                </div>

                <div className="flex-1 text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-white">
                    {page.content?.trim() ? (
                        <div>{page.content}</div>
                    ) : (
                        <div className="text-red-400">⚠️ No content found in Supabase row.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
