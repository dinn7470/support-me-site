import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../supabase-client";
import { User, AuthResponse, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (
        email: string,
        password: string,
        options?: {
            data?: Record<string, any>;
            options?: { emailRedirectTo?: string };
        }
    ) => Promise<AuthResponse>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: AuthError | null }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
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
        if (!error && data?.user) setUser(data.user);
    };

    const signUp: AuthContextType["signUp"] = async (email, password, options) =>
        await supabase.auth.signUp({
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


    const signIn: AuthContextType["signIn"] = async (email, password) =>
        await supabase.auth.signInWithPassword({ email, password });

    const signOut: AuthContextType["signOut"] = async () =>
        await supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
