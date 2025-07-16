import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    // 👇 Only enforce plan selection during onboarding
    if (isOnboarding && !hasPlan && !isOnPlansPage) {
        return _jsx(Navigate, { to: "/plans?onboarding=true", replace: true });
    }
    // Redirect out of plans page if user finished onboarding
    if (hasPlan && isOnPlansPage) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs(_Fragment, { children: [(hasPlan || !isOnboarding) && _jsx(Navbar, {}), _jsx(Outlet, {})] }));
}
