import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukjtqzbqmwhwpfyorgfi.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as String;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);