import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 🆕
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false); // ✅ finish rehydration
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener?.subscription.unsubscribe();
    }, []);
    const refreshUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user)
            setUser(data.user);
    };
    const signUp = async (email, password, options) => await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: options?.data?.username ?? email.split("@")[0],
                first_name: options?.data?.first_name ?? "",
                last_name: options?.data?.last_name ?? "",
                avatar_url: options?.data?.avatar_url ?? ""
            },
            emailRedirectTo: options?.options?.emailRedirectTo,
        },
    });
    const signIn = async (email, password) => await supabase.auth.signInWithPassword({ email, password });
    const signOut = async () => await supabase.auth.signOut();
    return (_jsx(AuthContext.Provider, { value: { user, loading, signUp, signIn, signOut, refreshUser }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
