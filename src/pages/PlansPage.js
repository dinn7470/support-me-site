import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/PlansPage.tsx
// vite-project/src/pages/PlansPage.tsx
import { useEffect } from "react";
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
        if (!user)
            return;
        const hasPlan = !!user.user_metadata?.plan;
        if (!isOnboarding && hasPlan) {
            navigate("/");
        }
    }, [user, isOnboarding, navigate]);
    const updatePlan = async (selectedPlan) => {
        if (!user)
            return;
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
    return (_jsx("div", { className: "pt-24 px-4 min-h-screen bg-white text-black", children: _jsxs("div", { className: "max-w-xl mx-auto space-y-8", children: [_jsx("h1", { className: "text-4xl font-bold text-center", children: isOnboarding ? "Select your Plan to Finish Setup" : "Choose a Plan" }), _jsxs("div", { className: "bg-gray-100 rounded-lg p-6 shadow space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Community Plan" }), _jsx("p", { className: "text-lg font-medium text-green-700", children: "$4.99 per month" }), _jsx("p", { children: "With just $5/month, you\u2019re paying it forward to help people like you\u2014facing medical costs like prescriptions, rides, or co-pays." }), _jsx("p", { children: "Your contribution goes into a shared fund that gives quick help when someone needs it most." }), _jsx("p", { children: "And if you ever need help, that same fund is here for you too. Give a little, receive when needed, and keep the care going." }), _jsx("p", { className: "font-semibold", children: "Cancel anytime. No pressure." }), _jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded", onClick: () => updatePlan("community"), children: "Choose Community Plan" })] }), _jsxs("div", { className: "bg-gray-100 rounded-lg p-6 shadow space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-500", children: "Free Plan" }), _jsx("p", { className: "text-lg font-medium text-gray-600", children: "$0.00 per month" }), _jsx("p", { children: "Get support, share your story, and connect with others in similar situations. Join virtual groups, read real updates, and donate to someone if you feel moved to help." }), _jsx("p", { className: "font-semibold", children: "No cost. No commitment. Just a caring space to be part of." }), _jsx("button", { className: "bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded", onClick: () => updatePlan("free"), children: "Choose Free Plan" })] })] }) }));
};
export default PlansPage;
