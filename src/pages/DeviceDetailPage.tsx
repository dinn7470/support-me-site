import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const DeviceDetailPage = () => {
    // ✅ Type the params properly
    const { id } = useParams<{ id: string }>();
    const [device, setDevice] = useState<any>(null);

    useEffect(() => {
        const fetchDevice = async () => {
            // ✅ Prevent undefined ID from reaching Supabase
            if (!id) return;

            const { data, error } = await supabase
                .from("device_posts")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) setDevice(data);
            else console.error("Failed to fetch device post:", error);
        };

        fetchDevice();
    }, [id]);

    if (!device) return <div className="p-4">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <img
                src={device.image_url}
                className="w-full rounded"
                alt={device.title}
            />
            <h1 className="text-2xl font-bold">{device.title}</h1>
            <p>{device.description}</p>
            <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => alert("Contact feature coming soon")}
            >
                Inquire
            </button>
        </div>
    );
};

export default DeviceDetailPage;
