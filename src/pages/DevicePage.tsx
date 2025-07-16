import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { uploadImage } from "../assets/UploadImage";
import toast from "react-hot-toast";

interface DevicePost {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
}

const DevicePage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<DevicePost[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("device_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) setPosts(data);
        };
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.error("You must be logged in");

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

            if (error) throw error;

            toast.success("Device posted!");
            setTitle("");
            setDescription("");
            setImageFile(null);
        } catch (err) {
            console.error(err);
            toast.error("Error posting device");
        }
    };

    return (
        <div className="pt-24 max-w-3xl mx-auto px-4 space-y-8">
            <h1 className="text-3xl font-bold text-center">Give or Receive a Device</h1>

            {/* Post form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
            >
                <h2 className="text-xl font-semibold">Post a Free Device</h2>
                <input
                    type="text"
                    placeholder="Device Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded bg-white dark:bg-black"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded bg-white dark:bg-black"
                    rows={3}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Post Device
                </button>
            </form>

            {/* Device listings */}
            <div className="grid gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border rounded p-4 bg-white dark:bg-zinc-800 shadow"
                    >
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded mb-3"
                        />
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                        <p>{post.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DevicePage;
