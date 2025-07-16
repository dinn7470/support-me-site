import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { supabase } from './supabase-client';
export const SupabaseSignUpDebug = () => {
    useEffect(() => {
        const runTest = async () => {
            const { data, error } = await supabase.auth.signUp({
                email: "debug-test@example.com",
                password: "Password!123",
            });
            console.log("[DEBUG SIGNUP RESULT]", { data, error });
            if (error) {
                alert("SignUp error:\n" + error.message);
            }
            else {
                alert("SignUp succeeded! Check your email.");
            }
        };
        runTest();
    }, []);
    return _jsx("div", { className: "p-8 text-white", children: "Running Supabase SignUp debug test..." });
};
export default SupabaseSignUpDebug;
