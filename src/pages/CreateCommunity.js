import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { v4 as uuidv4 } from "uuid";
export const CreateCommunity = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bannerFile, setBannerFile] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        let banner_url = "";
        if (bannerFile) {
            const fileExt = bannerFile.name.split(".").pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from("community-banners")
                .upload(fileName, bannerFile);
            if (uploadError) {
                setError("Failed to upload banner image.");
                return;
            }
            const { data: publicUrl } = supabase.storage
                .from("community-banners")
                .getPublicUrl(fileName);
            banner_url = publicUrl?.publicUrl || "";
        }
        const { data, error: insertError } = await supabase
            .from("communities")
            .insert({ name, description, banner_url })
            .select()
            .single();
        if (insertError) {
            setError("Could not create community.");
        }
        else {
            navigate(`/community/${data.id}`);
        }
    };
    return (_jsx("div", { className: "pt-24 px-4 min-h-screen bg-black text-white", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-fuchsia-500 text-center", children: "Create a Community" }), error && _jsx("p", { className: "text-red-500 mb-4", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 border border-gray-800 p-6 rounded-lg", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Community Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full bg-black border border-gray-700 px-3 py-2 rounded text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Description / Rules" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), required: true, rows: 5, className: "w-full bg-black border border-gray-700 px-3 py-2 rounded text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Banner Image" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "w-full bg-black text-white" })] }), _jsx("button", { type: "submit", className: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded", children: "Create Community" })] })] }) }));
};
