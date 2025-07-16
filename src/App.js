import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./context/RealAuthContext";
import Home from "./pages/Home";
import { Navbar } from "./components/Navbar";
import Communities from "./pages/Communities";
import CommunityPage from "./pages/CommunityPage";
import CreatePostPage from "./pages/CreatePostPage";
import AuthPage from "./pages/AuthPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/CreateAccount";
import AuthCallback from "./pages/AuthCallback";
import { About } from "./pages/About";
import StoriesFeedPage from "./pages/StoriesFeedPage";
import StoriesDonatePage from "./pages/StoriesDonatePage";
import StoriesHelpCreatePostPage from "./pages/StoriesHelpCreatePostPage";
import StoriesPaymentPage from "./pages/StoriesPaymentPage";
import PlansPage from "./pages/PlansPage";
import SupabaseSignUpDebug from "./SupabaseSignUpDebug";
import DeviceFeedPage from "./pages/DeviceFeedPage";
import DevicePostFormPage from "./pages/DevicePostFormPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import DeviceMessages from "./pages/DeviceMessages"; // ✅ NEW IMPORT
function ProtectedLayout() {
    const { user } = useAuth();
    const location = useLocation();
    const hasPlan = !!user?.user_metadata?.plan;
    if (!user) {
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    if (!hasPlan) {
        return _jsx(Navigate, { to: "/plans?onboarding=true", replace: true });
    }
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx(Outlet, {})] }));
}
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/signin", element: _jsx(SignInPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(AuthCallback, {}) }), _jsx(Route, { path: "/plans", element: _jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx(PlansPage, {})] }) }), _jsx(Route, { path: "/debug-signup", element: _jsx(SupabaseSignUpDebug, {}) }), _jsxs(Route, { element: _jsx(ProtectedLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/communities", element: _jsx(Communities, {}) }), _jsx(Route, { path: "/community/:id", element: _jsx(CommunityPage, {}) }), _jsx(Route, { path: "/community/:id/create", element: _jsx(CreatePostPage, {}) }), _jsx(Route, { path: "/stories", element: _jsx(StoriesFeedPage, {}) }), _jsx(Route, { path: "/stories/create", element: _jsx(StoriesHelpCreatePostPage, {}) }), _jsx(Route, { path: "/stories/:id/donate", element: _jsx(StoriesDonatePage, {}) }), _jsx(Route, { path: "/stories/:id/payment", element: _jsx(StoriesPaymentPage, {}) }), _jsx(Route, { path: "/devices", element: _jsx(DeviceFeedPage, {}) }), _jsx(Route, { path: "/devices/new", element: _jsx(DevicePostFormPage, {}) }), _jsx(Route, { path: "/devices/:id", element: _jsx(DeviceDetailPage, {}) }), _jsx(Route, { path: "/messages/new", element: _jsx(DeviceMessages, {}) })] }), _jsx(Route, { path: "*", element: _jsx("div", { className: "pt-24 text-red-500 text-center", children: "404 - Not Found" }) })] }));
}
export default App;
