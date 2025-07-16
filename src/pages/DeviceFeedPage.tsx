import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { useNavigate } from "react-router-dom";

interface Profile {
    user_name: string | null;
    avatar_url: string | null;
}

interface DevicePost {
    id: string;
    title: string;
    description: string;
    image_url: string;
    user_id: string;
    profiles?: Profile;
}

const DeviceFeedPage = () => {
    const [devices, setDevices] = useState<DevicePost[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            const { data, error } = await supabase
                .from("device_posts")
                .select("*, profiles(user_name, avatar_url)")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Failed to fetch devices:", error);
            } else {
                console.log("Fetched devices:", data);
                setDevices(data || []);
            }

            setLoading(false);
        };

        fetchDevices();
    }, []);

    const sendInquiry = (recipientId: string) => {
        navigate(`/messages/new?to=${recipientId}`);
    };

    return (
        <div className="pt-24 px-4">
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold mb-2 text-center">Available Medical Devices</h1>
                <p className="text-gray-600 text-center mb-6">
                    These devices have been made available for free by other users. If you're in need, feel free to inquire directly.
                </p>
                <div className="flex justify-end">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => navigate("/devices/new")}
                    >
                        Post a Device
                    </button>
                </div>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : devices.length === 0 ? (
                    <p className="text-center text-gray-500">No devices have been posted yet.</p>
                ) : (
                    devices.map((device) => (
                        <DeviceCard key={device.id} device={device} currentUserId={user?.id} onInquire={sendInquiry} />
                    ))
                )}
            </div>
        </div>
    );
};

const DeviceCard = ({ device, currentUserId, onInquire }: { device: DevicePost; currentUserId: string | undefined; onInquire: (id: string) => void }) => {
    const [hideImage, setHideImage] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        console.error("❌ Failed image URL:", target.src);
        target.onerror = null;
        setHideImage(true);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 border">
            {!hideImage && device.image_url ? (
                <img
                    src={device.image_url}
                    alt={device.title}
                    className="w-full max-h-[400px] object-contain rounded mb-2"
                    onError={handleImageError}
                />
            ) : hideImage ? (
                <div className="w-full h-48 bg-red-50 text-red-500 border border-red-400 flex items-center justify-center rounded mb-2">
                    Image could not be loaded.
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 rounded mb-2 border border-red-400">
                    No Image Provided
                </div>
            )}

            <h2 className="text-xl font-semibold text-blue-600">{device.title}</h2>
            <p className="text-gray-700 mb-3">{device.description}</p>

            <div className="flex items-center gap-2">
                {device.profiles?.avatar_url && (
                    <img
                        src={device.profiles.avatar_url}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}
                <span className="text-sm text-gray-600">
                    Posted by {" "}
                    <span className="font-medium text-black">
                        {device.profiles?.user_name ?? "Unknown"}
                    </span>
                </span>
            </div>

            {device.user_id !== currentUserId && (
                <button
                    onClick={() => onInquire(device.user_id)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                    Inquire
                </button>
            )}
        </div>
    );
};

export default DeviceFeedPage;
