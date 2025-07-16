import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/RealAuthContext";
import { Navbar } from '../components/Navbar';

function ProtectedLayout() {
    const { user } = useAuth();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const isOnboarding = searchParams.get("onboarding") === "true";

    const hasPlan = !!user?.user_metadata?.plan;
    const isOnPlansPage = location.pathname === "/plans";

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // 👇 Only enforce plan selection during onboarding
    if (isOnboarding && !hasPlan && !isOnPlansPage) {
        return <Navigate to="/plans?onboarding=true" replace />;
    }

    // Redirect out of plans page if user finished onboarding
    if (hasPlan && isOnPlansPage) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {/* Show navbar if not onboarding OR if plan is selected */}
            {(hasPlan || !isOnboarding) && <Navbar />}
            <Outlet />
        </>
    );
}
