import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
const DeviceDetailPage = () => {
    // ✅ Type the params properly
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    useEffect(() => {
        const fetchDevice = async () => {
            // ✅ Prevent undefined ID from reaching Supabase
            if (!id)
                return;
            const { data, error } = await supabase
                .from("device_posts")
                .select("*")
                .eq("id", id)
                .single();
            if (!error)
                setDevice(data);
            else
                console.error("Failed to fetch device post:", error);
        };
        fetchDevice();
    }, [id]);
    if (!device)
        return _jsx("div", { className: "p-4", children: "Loading..." });
    return (_jsxs("div", { className: "max-w-xl mx-auto p-4 space-y-4", children: [_jsx("img", { src: device.image_url, className: "w-full rounded", alt: device.title }), _jsx("h1", { className: "text-2xl font-bold", children: device.title }), _jsx("p", { children: device.description }), _jsx("button", { className: "mt-4 bg-green-600 text-white px-4 py-2 rounded", onClick: () => alert("Contact feature coming soon"), children: "Inquire" })] }));
};
export default DeviceDetailPage;
