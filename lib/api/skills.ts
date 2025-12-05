import { createClient } from "@/lib/supabase/server";
import type { Skill, SkillCategory } from "@/types";

/**
 * Fetches all skills ordered by display_order.
 */
export async function getSkills(): Promise<Skill[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching skills:", error);
        return [];
    }

    return data || [];
}

/**
 * Fetches skills grouped by category.
 */
export async function getSkillsByCategory(): Promise<
    Record<SkillCategory, Skill[]>
> {
    const skills = await getSkills();

    return skills.reduce(
        (acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        },
        {} as Record<SkillCategory, Skill[]>
    );
}
