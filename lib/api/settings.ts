// Client-side only API for settings
import { createClient } from "@/lib/supabase/client";

export type SiteSettings = {
    general: {
        name: string;
        title: string;
        tagline: string;
        bio: string;
        status: string;
    };
    contact: {
        email: string;
        phone: string;
        location: string;
    };
    social: {
        twitter: string;
        github: string;
        linkedin: string;
        resume: string;
    };
    seo: {
        description: string;
        url: string;
        ogImage: string;
    };
    about: {
        content: string;
    };
};

/**
 * Get site settings by category (client-side)
 */
export async function getSiteSettingByKey(key: keyof SiteSettings) {
    const supabase = createClient();
    
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

/**
 * Update site settings (client-side)
 * Uses API route to trigger revalidation
 */
export async function updateSiteSettings(
    key: keyof SiteSettings,
    value: any
) {
    const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(`Error updating setting ${key}:`, error);
        throw new Error(error.error || "Failed to update settings");
    }

    return true;
}

/**
 * Get all site settings (client-side)
 * Can use API route or direct Supabase query
 */
export async function getAllSiteSettings(): Promise<SiteSettings> {
    try {
        // Try API route first (better for consistency with server-side)
        const response = await fetch("/api/settings", {
            cache: "no-store" // Always get fresh data in admin
        });
        
        if (response.ok) {
            const json = await response.json();
            // API returns { ok: true, data: settings }
            return json.data as SiteSettings;
        }
    } catch (error) {
        console.warn("API route failed, falling back to direct query:", error);
    }

    // Fallback to direct Supabase query
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from("settings")
        .select("category, data");

    if (error) {
        console.error("Error fetching site settings:", error);
        throw error;
    }

    const settings: any = {
        general: {},
        contact: {},
        social: {},
        seo: {},
        about: {}
    };
    
    data?.forEach((item) => {
        settings[item.category] = item.data;
    });

    return settings as SiteSettings;
}
