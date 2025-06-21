import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthProvider} from "./context/AuthContext";

const client = new QueryClient();

const root = createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <AuthProvider>
            <Router>
                <App />
            </Router>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

