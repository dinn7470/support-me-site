import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { theme } from "../theme";

interface Community {
    id: number;
    name: string;
    description: string;
    banner_url: string;
}

const Home = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState<Community[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const load = async () => {
            const userEmail = user?.email;
            if (!userEmail) return;

            const { data: memberData, error: memberError } = await supabase
                .from("community_members")
                .select("community_id")
                .eq("user_email", userEmail);

            if (memberError) {
                console.error("Error fetching community members:", memberError.message);
                return;
            }

            const ids = (memberData ?? []).map((m) => m.community_id);
            if (!ids.length) return;

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

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold text-primary text-center">Your Communities</h2>

                {communities.length === 0 ? (
                    <p className="text-center text-muted">You're not in any communities yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {communities.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => navigate(`/community/${c.id}`)}
                                className={`cursor-pointer overflow-hidden ${theme.bg.card} ${theme.shadow.card} ${theme.radius.box}`}
                            >
                                <img
                                    src={c.banner_url}
                                    alt={`${c.name} banner`}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-accent">{c.name}</h3>
                                    <p className="text-sm text-muted">{c.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
