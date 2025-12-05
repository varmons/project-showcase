import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types";

/**
 * Fetches all experiences ordered by display_order.
 */
export async function getExperiences(): Promise<Experience[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }

    return data || [];
}

/**
 * Fetches a single experience by ID.
 */
export async function getExperienceById(
    id: string
): Promise<Experience | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching experience:", error);
        return null;
    }

    return data;
}
