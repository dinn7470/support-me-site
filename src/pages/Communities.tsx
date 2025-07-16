import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";

interface Community {
    id: number;
    name: string;
    description: string;
    banner_url: string;
}

const Communities = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from("communities").select("*");
            setCommunities(data ?? []);
        };
        void load();
    }, []);

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-primary text-center">All Communities</h1>

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
            </div>
        </div>
    );
};

export default Communities;
