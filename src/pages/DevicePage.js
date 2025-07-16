import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { uploadImage } from "../assets/UploadImage";
import toast from "react-hot-toast";
const DevicePage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("device_posts")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data)
                setPosts(data);
        };
        fetchPosts();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return toast.error("You must be logged in");
        if (!title || !description || !imageFile) {
            return toast.error("All fields are required");
        }
        try {
            const imageUrl = await uploadImage(imageFile, user.id);
            const { error } = await supabase.from("device_posts").insert([
                {
                    title,
                    description,
                    image_url: imageUrl,
                    user_id: user.id,
                },
            ]);
            if (error)
                throw error;
            toast.success("Device posted!");
            setTitle("");
            setDescription("");
            setImageFile(null);
        }
        catch (err) {
            console.error(err);
            toast.error("Error posting device");
        }
    };
    return (_jsxs("div", { className: "pt-24 max-w-3xl mx-auto px-4 space-y-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center", children: "Give or Receive a Device" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Post a Free Device" }), _jsx("input", { type: "text", placeholder: "Device Title", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full border px-3 py-2 rounded bg-white dark:bg-black", required: true }), _jsx("textarea", { placeholder: "Description", value: description, onChange: (e) => setDescription(e.target.value), className: "w-full border px-3 py-2 rounded bg-white dark:bg-black", rows: 3, required: true }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setImageFile(e.target.files?.[0] || null), className: "w-full", required: true }), _jsx("button", { type: "submit", className: "bg-primary text-white px-4 py-2 rounded hover:bg-blue-700", children: "Post Device" })] }), _jsx("div", { className: "grid gap-6", children: posts.map((post) => (_jsxs("div", { className: "border rounded p-4 bg-white dark:bg-zinc-800 shadow", children: [_jsx("img", { src: post.image_url, alt: post.title, className: "w-full h-48 object-cover rounded mb-3" }), _jsx("h3", { className: "text-xl font-semibold", children: post.title }), _jsx("p", { children: post.description })] }, post.id))) })] }));
};
export default DevicePage;
