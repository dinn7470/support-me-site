import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="max-w-5xl mx-auto">{children}</div>
        </div>
    );
};