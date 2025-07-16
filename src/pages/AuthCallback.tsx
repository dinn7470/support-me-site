// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";

const AuthCallback = () => {
    const navigate = useNavigate(); // ✅ Correct usage

    useEffect(() => {
        const sub = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                try {
                    await supabase.from("users").insert({
                        id: session.user.id,
                        email: session.user.email,
                    });
                } catch (_) {
                    // ignore duplicate insert errors
                }

                navigate("/"); // ✅ Valid here
            }
        });

        return () => sub.data.subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <p className="text-lg">Logging you in, please wait...</p>
        </div>
    );
};

export default AuthCallback;
