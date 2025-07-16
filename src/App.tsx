import * as React from "react";
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
        return <Navigate to="/auth" replace />;
    }

    if (!hasPlan) {
        return <Navigate to="/plans?onboarding=true" replace />;
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/plans" element={<><Navbar /><PlansPage /></>} />
            <Route path="/debug-signup" element={<SupabaseSignUpDebug />} />

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/community/:id" element={<CommunityPage />} />
                <Route path="/community/:id/create" element={<CreatePostPage />} />

                {/* Stories feature */}
                <Route path="/stories" element={<StoriesFeedPage />} />
                <Route path="/stories/create" element={<StoriesHelpCreatePostPage />} />
                <Route path="/stories/:id/donate" element={<StoriesDonatePage />} />
                <Route path="/stories/:id/payment" element={<StoriesPaymentPage />} />

                {/* Medical devices */}
                <Route path="/devices" element={<DeviceFeedPage />} />
                <Route path="/devices/new" element={<DevicePostFormPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />

                {/* ✅ Device messages */}
                <Route path="/messages/new" element={<DeviceMessages />} />
            </Route>

            {/* Catch-all */}
            <Route
                path="*"
                element={<div className="pt-24 text-red-500 text-center">404 - Not Found</div>}
            />
        </Routes>
    );
}

export default App;


