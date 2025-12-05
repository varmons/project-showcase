import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/types";

/**
 * Fetches all tags.
 */
export async function getTags(): Promise<Tag[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching tags:", error);
        return [];
    }

    return data || [];
}

/**
 * Fetches tags that are used by projects.
 */
export async function getProjectTags(): Promise<Tag[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tags")
        .select(
            `
      *,
      projects:project_tags(project_id)
    `
        )
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching project tags:", error);
        return [];
    }

    // Filter to only tags that have projects
    return (data || [])
        .filter((tag: Tag & { projects?: unknown[] }) => tag.projects && tag.projects.length > 0)
        .map(({ projects, ...tag }: Tag & { projects?: unknown[] }) => tag as Tag);
}
