export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string; // ISO string from Supabase
    author_email?: string;
    author_name?: string;
    author_avatar_url?: string;
}

