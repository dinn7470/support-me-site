import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/RealAuthContext";

interface Message {
    id: string;
    post_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    sender_profile?: {
        user_name: string | null;
        avatar_url: string | null;
    };
}

interface DevicePost {
    id: string;
    title: string;
    image_url: string;
}

export default function DeviceMessages() {
    const [searchParams] = useSearchParams();
    const receiverId = searchParams.get("to");
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [devicePost, setDevicePost] = useState<DevicePost | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const senderId = user?.id;
    const postId = null;

    useEffect(() => {
        if (!receiverId || !senderId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*, sender_profile:profiles(user_name, avatar_url)")
                .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setMessages(data);
                setUnreadCount(data.filter(m => m.receiver_id === senderId).length);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel("messages-channel")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                () => {
                    fetchMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [receiverId, senderId]);

    useEffect(() => {
        if (!receiverId) return;

        const fetchDevice = async () => {
            const { data, error } = await supabase
                .from("device_posts")
                .select("id, title, image_url")
                .eq("user_id", receiverId)
                .limit(1)
                .single();

            if (!error && data) setDevicePost(data);
        };

        fetchDevice();
    }, [receiverId]);

    const sendMessage = async () => {
        if (!content || !senderId || !receiverId) return;

        const { error } = await supabase.from("messages").insert({
            sender_id: senderId,
            receiver_id: receiverId,
            post_id: postId,
            content,
        });

        if (!error) {
            setContent("");
        }
    };

    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Send a Message</h1>

            {devicePost && (
                <div className="bg-white border rounded mb-4 p-3 shadow-sm">
                    <img src={devicePost.image_url} alt="" className="w-full h-40 object-cover rounded mb-2" />
                    <h2 className="text-xl font-semibold text-blue-600">{devicePost.title}</h2>
                </div>
            )}

            <div className="space-y-2 mb-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`text-sm p-2 rounded-lg w-fit max-w-xs ${msg.sender_id === senderId ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
                    >
                        <span className="block text-xs text-gray-500">
                            {msg.sender_id === senderId ? "You" : msg.sender_profile?.user_name || "User"} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="text-gray-800">{msg.content}</span>
                    </div>
                ))}
            </div>

            {unreadCount > 0 && (
                <p className="text-xs text-green-600 mb-2">
                    🔔 You have {unreadCount} message{unreadCount > 1 ? "s" : ""}
                </p>
            )}

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
