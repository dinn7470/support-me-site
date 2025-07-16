



import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/RealAuthContext';
import { ThemeProvider } from './context/ThemeProvider';

const client = new QueryClient();
const root = createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter basename="/support-me-site">
                        <App />
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);