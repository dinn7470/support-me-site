import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { uploadImage } from "../assets/UploadImage";
import toast from "react-hot-toast";
const DevicePostFormPage = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !file) {
            toast.error("Please complete all fields.");
            return;
        }
        setLoading(true);
        try {
            const image_url = await uploadImage(file, user?.id || "anonymous");
            console.log("🖼️ Uploaded image URL:", image_url); // Debug log
            const { error } = await supabase.from("device_posts").insert([
                {
                    title,
                    description,
                    image_url,
                    user_id: user?.id,
                },
            ]);
            if (error)
                throw error;
            toast.success("Device posted!");
            navigate("/devices");
        }
        catch (error) {
            console.error("Error posting device:", error.message);
            toast.error("Failed to post device");
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
        else {
            setPreviewUrl(null);
        }
    };
    return (_jsxs("div", { className: "pt-24 px-4 max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-accent dark:text-white mb-2", children: "Share a Medical Device" }), _jsx("p", { className: "text-center text-gray-600 dark:text-gray-300 mb-6", children: "Help someone by giving away a medical device you no longer need." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 p-6 rounded-lg shadow-md bg-white dark:bg-zinc-900 border dark:border-zinc-700", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1 text-sm", children: "Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-3 py-2 border rounded-md bg-white dark:bg-black text-accent dark:text-white", placeholder: "Device title (e.g. Wheelchair, Walker)", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1 text-sm", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 4, className: "w-full px-3 py-2 border rounded-md bg-white dark:bg-black text-accent dark:text-white", placeholder: "Brief description of the device and its condition", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1 text-sm", children: "Image" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "text-sm text-accent dark:text-white", required: true }), previewUrl && (_jsx("img", { src: previewUrl, alt: "Image Preview", className: "mt-3 w-full h-48 object-cover rounded border" }))] }), _jsx("button", { type: "submit", className: "w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50", disabled: loading, children: loading ? "Posting..." : "Post Device" })] })] }));
};
export default DevicePostFormPage;
