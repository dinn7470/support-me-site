import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { v4 as uuidv4 } from "uuid";

export const CreateCommunity = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
        } else {
            navigate(`/community/${data.id}`);
        }
    };

    return (
        <div className="pt-24 px-4 min-h-screen bg-black text-white">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-fuchsia-500 text-center">
                    Create a Community
                </h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6 border border-gray-800 p-6 rounded-lg">
                    <div>
                        <label className="block text-sm mb-1">Community Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 px-3 py-2 rounded text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Description / Rules</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={5}
                            className="w-full bg-black border border-gray-700 px-3 py-2 rounded text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Banner Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-black text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded"
                    >
                        Create Community
                    </button>
                </form>
            </div>
        </div>
    );
};

