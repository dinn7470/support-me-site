import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";
import { useNavigate } from "react-router-dom";
const DeviceFeedPage = () => {
    const [devices, setDevices] = useState([]);
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
            }
            else {
                console.log("Fetched devices:", data);
                setDevices(data || []);
            }
            setLoading(false);
        };
        fetchDevices();
    }, []);
    const sendInquiry = (recipientId) => {
        navigate(`/messages/new?to=${recipientId}`);
    };
    return (_jsxs("div", { className: "pt-24 px-4", children: [_jsxs("div", { className: "max-w-4xl mx-auto mb-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-2 text-center", children: "Available Medical Devices" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "These devices have been made available for free by other users. If you're in need, feel free to inquire directly." }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded", onClick: () => navigate("/devices/new"), children: "Post a Device" }) })] }), _jsx("div", { className: "space-y-6 max-w-2xl mx-auto", children: loading ? (_jsx("p", { className: "text-center text-gray-500", children: "Loading..." })) : devices.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "No devices have been posted yet." })) : (devices.map((device) => (_jsx(DeviceCard, { device: device, currentUserId: user?.id, onInquire: sendInquiry }, device.id)))) })] }));
};
const DeviceCard = ({ device, currentUserId, onInquire }) => {
    const [hideImage, setHideImage] = useState(false);
    const handleImageError = (e) => {
        const target = e.currentTarget;
        console.error("❌ Failed image URL:", target.src);
        target.onerror = null;
        setHideImage(true);
    };
    return (_jsxs("div", { className: "bg-white shadow-md rounded-lg p-4 border", children: [!hideImage && device.image_url ? (_jsx("img", { src: device.image_url, alt: device.title, className: "w-full max-h-[400px] object-contain rounded mb-2", onError: handleImageError })) : hideImage ? (_jsx("div", { className: "w-full h-48 bg-red-50 text-red-500 border border-red-400 flex items-center justify-center rounded mb-2", children: "Image could not be loaded." })) : (_jsx("div", { className: "w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 rounded mb-2 border border-red-400", children: "No Image Provided" })), _jsx("h2", { className: "text-xl font-semibold text-blue-600", children: device.title }), _jsx("p", { className: "text-gray-700 mb-3", children: device.description }), _jsxs("div", { className: "flex items-center gap-2", children: [device.profiles?.avatar_url && (_jsx("img", { src: device.profiles.avatar_url, alt: "User Avatar", className: "w-8 h-8 rounded-full object-cover" })), _jsxs("span", { className: "text-sm text-gray-600", children: ["Posted by ", " ", _jsx("span", { className: "font-medium text-black", children: device.profiles?.user_name ?? "Unknown" })] })] }), device.user_id !== currentUserId && (_jsx("button", { onClick: () => onInquire(device.user_id), className: "mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded", children: "Inquire" }))] }));
};
export default DeviceFeedPage;
