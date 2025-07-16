import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase-client";
import { theme } from "../theme";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATAR_URL = "/assets/default-avatar.jpg";

const StoriesPaymentPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state } = useLocation();
    const donationAmount = state?.amount;

    const [story, setStory] = useState<any>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from("posts")
                .select(`
                    id, title, content, goal_amount, created_at, thank_you_message,
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
        };

        fetchStory();
    }, [id]);

    const profile = story?.profiles;
    const displayName =
        profile?.first_name && profile?.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : profile?.user_name || "Anonymous";

    const handleDonation = () => setShowConfirm(true);
    const handleCancel = () => setShowConfirm(false);

    const handleConfirm = () => {
        setShowConfirm(false);
        setTimeout(() => {
            setShowAnimation(true);
            setTimeout(() => {
                navigate("/stories");
            }, 3000);
        }, 300);
    };

    return (
        <div className={`pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`}>
            <div className="max-w-md mx-auto space-y-6 text-center">
                <h1 className="text-3xl font-bold text-primary">Confirm Your Donation</h1>

                <img
                    src={profile?.avatar_url || DEFAULT_AVATAR_URL}
                    alt={displayName}
                    className="w-20 h-20 rounded-full mx-auto object-cover border"
                />

                <p>
                    You’re donating <strong>${donationAmount}</strong> to{" "}
                    <strong>{displayName}</strong>.
                </p>

                <div className={`${theme.bg.card} ${theme.shadow.card} ${theme.radius.box} p-6 space-y-4`}>
                    <input className="w-full px-3 py-2 border rounded bg-white dark:bg-black" placeholder="Card Number" />
                    <input className="w-full px-3 py-2 border rounded bg-white dark:bg-black" placeholder="Name on Card" />
                    <input className="w-full px-3 py-2 border rounded bg-white dark:bg-black" placeholder="MM/YY" />
                    <input className="w-full px-3 py-2 border rounded bg-white dark:bg-black" placeholder="CVC" />

                    <button
                        onClick={handleDonation}
                        className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700"
                    >
                        Complete Donation
                    </button>
                </div>
            </div>

            {/* ✅ Confirmation Modal */}
            {showConfirm && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-5 rounded-xl shadow-xl text-center w-80">
                            <p className="text-lg mb-4">
                                Confirm you’d like to donate to {displayName}?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* ✅ Thank You Animation */}
            {showAnimation && (
                <AnimatePresence>
                    <motion.div
                        key="thankyou"
                        className="fixed inset-0 z-[200] bg-black bg-opacity-90 flex flex-col items-center justify-center text-white text-center px-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={profile?.avatar_url || DEFAULT_AVATAR_URL}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white mb-4"
                        />
                        <motion.p
                            className="text-xl font-semibold"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {story?.thank_you_message || "Thank you for your support!"}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default StoriesPaymentPage;
