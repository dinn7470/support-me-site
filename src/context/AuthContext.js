import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Initial session load
        const getUserSession = async () => {
            const { data: { session }, } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            }
        };
        getUserSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);
    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({ provider: "google" });
    };
    const signOut = () => {
        supabase.auth.signOut();
    };
    return (_jsx(AuthContext.Provider, { value: { user, signInWithGoogle, signOut }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
};
