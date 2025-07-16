module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#0ea5e9',
                accent: '#0f172a',
                background: '#f9fafb',
                surface: '#ffffff',
                muted: '#6b7280',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                xl: '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                card: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
};
