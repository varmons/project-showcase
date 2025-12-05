// Server-side only API for settings
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "./settings";

/**
 * Get all site settings (server-side)
 * Reads from the `settings` table (category, data JSON)
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("settings")
            .select("category, data");

        if (error) {
            console.error("Error fetching site settings:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return null;
        }

        if (!data || data.length === 0) {
            console.warn("No site settings found in database");
            return null;
        }

        // Transform array to object keyed by category
        const settings: Record<string, any> = {};
        data.forEach((item) => {
            settings[item.category] = item.data;
        });

        return settings as SiteSettings;
    } catch (err) {
        console.error("Exception in getSiteSettings:", err);
        return null;
    }
}

/**
 * Get site settings by key (server-side)
 */
export async function getSiteSettingByKey(key: keyof SiteSettings) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("settings")
        .select("data")
        .eq("category", key)
        .single();

    if (error) {
        console.error(`Error fetching setting ${key}:`, error);
        return null;
    }

    return data?.data;
}
