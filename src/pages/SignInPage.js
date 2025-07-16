import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/RealAuthContext';
import { supabase } from '../supabase-client';
import toast from 'react-hot-toast';
import { theme } from '../theme';
const SignInPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password)
            return toast.error("Email and password are required");
        try {
            setLoading(true);
            const { error } = await auth.signIn(email, password);
            if (error)
                toast.error("Invalid credentials");
            else {
                toast.success("Signed in");
                navigate("/");
            }
        }
        catch (err) {
            toast.error("Unexpected error");
        }
        finally {
            setLoading(false);
        }
    };
    const handleForgotPassword = async () => {
        if (!email)
            return toast.error("Enter email to reset password");
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error)
            toast.error("Could not send reset link");
        else
            toast.success("Reset link sent");
    };
    return (_jsx("div", { className: `pt-24 px-4 min-h-screen ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-primary mb-8", children: "Sign In" }), _jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: `w-full p-3 ${theme.bg.card} ${theme.border.input} ${theme.radius.box}` }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: `w-full p-3 pr-16 ${theme.bg.card} ${theme.border.input} ${theme.radius.box}` }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 px-3 text-sm text-muted", children: showPassword ? 'Hide' : 'Show' })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("button", { type: "button", onClick: handleForgotPassword, className: "text-primary hover:underline", children: "Forgot Password?" }), _jsx(Link, { to: "/signup", className: "text-primary hover:underline", children: "Sign Up" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700", children: loading ? 'Signing in...' : 'Sign In' }), _jsx("div", { className: "text-center mt-4", children: _jsx(Link, { to: "/", className: "text-muted hover:underline", children: "Back to Home" }) })] })] }) }));
};
export default SignInPage;
