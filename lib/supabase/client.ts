import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser/client-side usage.
 * Use this in client components and React Query hooks.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables!");
        console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
        console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing");
        throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
