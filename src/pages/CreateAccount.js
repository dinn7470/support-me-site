import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { theme } from "../theme";
const InputField = ({ name, type = "text", placeholder, value, onChange, required = false }) => (_jsx("input", { name: name, type: type, placeholder: placeholder, value: value, onChange: onChange, required: required, className: `w-full px-3 py-2 ${theme.bg.card} ${theme.border.input} ${theme.radius.box} text-accent dark:text-white placeholder-gray-400` }));
async function uploadAvatar(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `public/${fileName}`;
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
    if (uploadError)
        throw uploadError;
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return urlData?.publicUrl ?? "";
}
const CreateAccount = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", username: "", password: "" });
    const [avatar, setAvatar] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                navigate("/home");
            }
        };
        void checkSession();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file)
            setAvatar(file);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("[SIGNUP PAYLOAD]", {
            email: form.email,
            password: form.password,
            avatar,
            options: {
                data: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                    phone: form.phone,
                    user_name: form.username,
                    avatar_url: avatar ? "(set)" : "(not set)",
                    plan: null,
                },
                emailRedirectTo: `${window.location.origin}/support-me-site/home`,
            }
        });
        setLoading(true);
        toast.dismiss();
        toast.loading("Sending verification email...");
        let avatar_url = "";
        try {
            if (avatar) {
                try {
                    avatar_url = await uploadAvatar(avatar);
                }
                catch (uploadErr) {
                    console.error("Avatar upload failed:", uploadErr);
                    toast.error("Avatar upload failed. Try again.");
                    return;
                }
            }
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        first_name: form.firstName,
                        last_name: form.lastName,
                        phone: form.phone,
                        user_name: form.username,
                        avatar_url
                    },
                    emailRedirectTo: `${window.location.origin}/`, // ✅ Main landing route
                },
            });
            if (error) {
                console.error("SIGNUP ERROR:", error); // <-- Add this
                toast.error(error.message);
            }
            toast.dismiss();
            if (error) {
                if (error.message.toLowerCase().includes("user already registered")) {
                    return toast.error("Email already registered. Try signing in.", { position: "top-center" });
                }
                return toast.error(error.message);
            }
            setVerificationSent(true);
            toast.success("Check email to verify!", { position: "top-center" });
        }
        catch (err) {
            toast.dismiss();
            toast.error(err.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    };
    const handleResend = async () => {
        if (!form.email)
            return toast.error("Enter email to resend link");
        const { error } = await supabase.auth.resend({ type: "signup", email: form.email });
        if (error)
            toast.error("Could not resend link");
        else
            toast.success("Verification email re-sent");
    };
    return (_jsx("div", { className: `min-h-screen flex items-center justify-center px-4 ${theme.bg.page} text-accent dark:text-white`, children: _jsxs("div", { className: `w-full max-w-sm space-y-6 p-6 ${theme.bg.card} ${theme.radius.box} ${theme.shadow.card} border border-gray-200 dark:border-zinc-800`, children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-primary", children: "Create Account" }), _jsx("p", { className: "text-sm text-muted mt-1", children: "Join the community" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(InputField, { name: "firstName", placeholder: "First Name", value: form.firstName, onChange: handleChange, required: true }), _jsx(InputField, { name: "lastName", placeholder: "Last Name", value: form.lastName, onChange: handleChange, required: true }), _jsx(InputField, { name: "email", type: "email", placeholder: "Email", value: form.email, onChange: handleChange, required: true }), _jsx(InputField, { name: "phone", type: "tel", placeholder: "Phone", value: form.phone, onChange: handleChange }), _jsx(InputField, { name: "username", placeholder: "Username", value: form.username, onChange: handleChange, required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Profile Picture (optional)" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleAvatarChange, className: "w-full bg-white text-black dark:bg-black dark:text-white" })] }), _jsxs("div", { className: "relative", children: [_jsx(InputField, { name: "password", type: showPassword ? "text" : "password", placeholder: "Password", value: form.password, onChange: handleChange, required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute top-2 right-3 text-sm text-muted", children: showPassword ? "Hide" : "Show" })] }), _jsx("button", { type: "submit", disabled: loading || verificationSent, className: "w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50", children: loading ? "Sending..." : verificationSent ? "Check Email" : "Create Account" }), verificationSent && (_jsx("button", { type: "button", onClick: handleResend, className: "text-sm text-primary underline w-full text-center", children: "Resend verification email" }))] })] }) }));
};
export default CreateAccount;
