import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { theme } from "../theme";
const Home = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user)
            return;
        const load = async () => {
            const userEmail = user?.email;
            if (!userEmail)
                return;
            const { data: memberData, error: memberError } = await supabase
                .from("community_members")
                .select("community_id")
                .eq("user_email", userEmail);
            if (memberError) {
                console.error("Error fetching community members:", memberError.message);
                return;
            }
            const ids = (memberData ?? []).map((m) => m.community_id);
            if (!ids.length)
                return;
            const { data: communityData, error: communityError } = await supabase
                .from("communities")
                .select("*")
                .in("id", ids);
            if (communityError) {
                console.error("Error fetching communities:", communityError.message);
                return;
            }
            setCommunities(communityData ?? []);
        };
        void load();
    }, [user]);
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsx("h2", { className: "text-3xl font-bold text-primary text-center", children: "Your Communities" }), communities.length === 0 ? (_jsx("p", { className: "text-center text-muted", children: "You're not in any communities yet." })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: communities.map((c) => (_jsxs("div", { onClick: () => navigate(`/community/${c.id}`), className: `cursor-pointer overflow-hidden ${theme.bg.card} ${theme.shadow.card} ${theme.radius.box}`, children: [_jsx("img", { src: c.banner_url, alt: `${c.name} banner`, className: "w-full h-32 object-cover" }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-accent", children: c.name }), _jsx("p", { className: "text-sm text-muted", children: c.description })] })] }, c.id))) }))] }) }));
};
export default Home;
