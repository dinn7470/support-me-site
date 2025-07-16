// src/pages/PlansPage.tsx
// vite-project/src/pages/PlansPage.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/RealAuthContext";
import { supabase } from "../supabase-client";
import toast from "react-hot-toast";

const PlansPage = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [searchParams] = useSearchParams();
    const isOnboarding = searchParams.get("onboarding") === "true";

    useEffect(() => {
        if (!user) return;
        const hasPlan = !!user.user_metadata?.plan;

        if (!isOnboarding && hasPlan) {
            navigate("/");
        }
    }, [user, isOnboarding, navigate]);

    const updatePlan = async (selectedPlan: string) => {
        if (!user) return;

        const { error } = await supabase.auth.updateUser({
            data: { plan: selectedPlan },
        });

        if (error) {
            toast.error("Failed to update plan");
            return;
        }

        await refreshUser(); // 🆕 refresh context with updated plan
        toast.success("Plan selected!");
        navigate("/");
    };

    return (
        <div className="pt-24 px-4 min-h-screen bg-white text-black">
            <div className="max-w-xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center">
                    {isOnboarding ? "Select your Plan to Finish Setup" : "Choose a Plan"}
                </h1>

                <div className="bg-gray-100 rounded-lg p-6 shadow space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Community Plan</h2>
                    <p className="text-lg font-medium text-green-700">$4.99 per month</p>
                    <p>
                        With just $5/month, you’re paying it forward to help people like you—facing
                        medical costs like prescriptions, rides, or co-pays.
                    </p>
                    <p>
                        Your contribution goes into a shared fund that gives quick help when
                        someone needs it most.
                    </p>
                    <p>
                        And if you ever need help, that same fund is here for you too. Give a
                        little, receive when needed, and keep the care going.
                    </p>
                    <p className="font-semibold">Cancel anytime. No pressure.</p>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
                        onClick={() => updatePlan("community")}
                    >
                        Choose Community Plan
                    </button>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 shadow space-y-4">
                    <h2 className="text-xl font-semibold text-gray-500">Free Plan</h2>
                    <p className="text-lg font-medium text-gray-600">$0.00 per month</p>
                    <p>
                        Get support, share your story, and connect with others in similar
                        situations. Join virtual groups, read real updates, and donate to someone if
                        you feel moved to help.
                    </p>
                    <p className="font-semibold">
                        No cost. No commitment. Just a caring space to be part of.
                    </p>
                    <button
                        className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded"
                        onClick={() => updatePlan("free")}
                    >
                        Choose Free Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlansPage;

