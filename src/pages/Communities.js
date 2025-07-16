import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from("communities").select("*");
            setCommunities(data ?? []);
        };
        void load();
    }, []);
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-primary text-center", children: "All Communities" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: communities.map((c) => (_jsxs("div", { onClick: () => navigate(`/community/${c.id}`), className: `cursor-pointer overflow-hidden ${theme.bg.card} ${theme.shadow.card} ${theme.radius.box}`, children: [_jsx("img", { src: c.banner_url, alt: `${c.name} banner`, className: "w-full h-32 object-cover" }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-accent", children: c.name }), _jsx("p", { className: "text-sm text-muted", children: c.description })] })] }, c.id))) })] }) }));
};
export default Communities;
