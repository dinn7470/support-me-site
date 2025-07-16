import React, { useState } from "react";
import { useAuth } from "../context/RealAuthContext";
import { supabase } from "../supabase-client";

const HelpPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ reason: "", amount: "" });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const { data, error } = await supabase.from("help_requests").insert([
            {
                user_id: user.id,
                reason: formData.reason,
                amount: parseFloat(formData.amount),
            },
        ]);

        if (error) {
            setError("Something went wrong. Please try again.");
        } else {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="pt-24 px-4 text-center text-green-700">
                <h2 className="text-2xl font-bold">Request Submitted</h2>
                <p>We'll review your request and get back to you soon.</p>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto text-black">
            <h1 className="text-3xl font-bold mb-6">Request Financial Assistance</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 p-6 rounded shadow">
                <div>
                    <label className="block font-medium mb-1">Why do you need help?</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded border"
                        rows={4}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">How much do you need? (USD)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                        className="w-full p-2 rounded border"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default HelpPage;
