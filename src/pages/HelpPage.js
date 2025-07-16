import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../context/RealAuthContext";
import { supabase } from "../supabase-client";
const HelpPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ reason: "", amount: "" });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        const { data, error } = await supabase.from("help_requests").insert([
            {
                user_id: user.id,
                reason: formData.reason,
                amount: parseFloat(formData.amount),
            },
        ]);
        if (error) {
            setError("Something went wrong. Please try again.");
        }
        else {
            setSubmitted(true);
        }
    };
    if (submitted) {
        return (_jsxs("div", { className: "pt-24 px-4 text-center text-green-700", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Request Submitted" }), _jsx("p", { children: "We'll review your request and get back to you soon." })] }));
    }
    return (_jsxs("div", { className: "pt-24 px-4 max-w-2xl mx-auto text-black", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Request Financial Assistance" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 bg-gray-100 p-6 rounded shadow", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Why do you need help?" }), _jsx("textarea", { name: "reason", value: formData.reason, onChange: handleChange, required: true, className: "w-full p-2 rounded border", rows: 4 })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "How much do you need? (USD)" }), _jsx("input", { type: "number", name: "amount", value: formData.amount, onChange: handleChange, required: true, min: "1", step: "0.01", className: "w-full p-2 rounded border" })] }), error && _jsx("p", { className: "text-red-500", children: error }), _jsx("button", { type: "submit", className: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded font-semibold", children: "Submit Request" })] })] }));
};
export default HelpPage;
