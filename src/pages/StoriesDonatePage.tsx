import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";

const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";
const PRESET_AMOUNTS = [5, 10, 20, 50];

const StoriesDonatePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from("posts")
                .select(`
                    id, title, content, goal_amount, created_at,
                    profiles:profiles!posts_user_id_fkey(
                        first_name, last_name, user_name, avatar_url
                    )
                `)
                .eq("id", id)
                .single();

            if (error) {
                console.error("Story fetch error:", error);
            } else {
                setStory(data);
            }

            setLoading(false);
        };

        fetchStory();
    }, [id]);

    const profile = story?.profiles;
    const displayName =
        (profile?.first_name && profile?.last_name)
            ? `${profile.first_name} ${profile.last_name}`
            : profile?.user_name || "Anonymous";

    const handlePresetClick = (val: number) => {
        setSelectedPreset(val);
        setCustomAmount("");
        setAmount(val.toString());
    };

    const handleCustomChange = (val: string) => {
        setCustomAmount(val);
        setSelectedPreset(null);
        setAmount(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        navigate(`/stories/${id}/payment`, {
            state: {
                amount,
                displayName,
                avatar: profile?.avatar_url || DEFAULT_AVATAR_URL,
            },
        });
    };

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-xl mx-auto space-y-6">
                {loading ? (
                    <h1 className="text-3xl font-bold text-center text-primary">Loading...</h1>
                ) : (
                    <>
                        <div className="text-center space-y-3">
                            <img
                                src={profile?.avatar_url || DEFAULT_AVATAR_URL}
                                alt={displayName}
                                className="w-20 h-20 rounded-full mx-auto border object-cover"
                                onError={(e) => {
                                    const fallback = DEFAULT_AVATAR_URL;
                                    if (!e.currentTarget.src.includes(fallback)) {
                                        e.currentTarget.src = fallback;
                                    }
                                }}
                            />
                            <h1 className="text-3xl font-bold text-primary">Support {displayName}</h1>
                            {story?.goal_amount && (
                                <p className="text-sm text-primary">Goal: ${story.goal_amount.toFixed(2)}</p>
                            )}
                        </div>

                        <div className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-6`}>
                            <p className="text-base dark:text-white">{story?.content}</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <p className="font-medium mb-2">Select an amount to donate:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PRESET_AMOUNTS.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => handlePresetClick(amt)}
                                                className={`px-4 py-2 rounded-md border ${
                                                    selectedPreset === amt
                                                        ? "bg-green-600 text-white"
                                                        : "bg-white dark:bg-black border-gray-300 text-accent"
                                                }`}
                                            >
                                                ${amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Or enter a custom amount</label>
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => handleCustomChange(e.target.value)}
                                        placeholder="e.g. 15"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black text-accent dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
                                >
                                    Send Support of ${amount || "0.00"}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoriesDonatePage;
