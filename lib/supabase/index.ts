// Client-side exports only
// Use @/lib/supabase/client for browser components
// Use @/lib/supabase/server for server components (import directly)

export { createClient as createBrowserClient } from "./client";

// Note: Server client should be imported directly from @/lib/supabase/server
// to avoid bundling server-only code in client bundles
