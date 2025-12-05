import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAnon } from "@supabase/supabase-js";
import type { Project, ProjectQueryOptions, Tag } from "@/types";

/**
 * Fetches all published projects with optional filtering.
 * Used in server components for initial page load.
 */
export async function getProjects(
    options: ProjectQueryOptions = {}
): Promise<Project[]> {
    const supabase = await createClient();

    const {
        categorySlug,
        featured,
        published = true,
        limit,
        offset,
        orderBy = "display_order",
        ascending = true,
    } = options;

    let query = supabase
        .from("projects")
        .select(
            `
      id,
      slug,
      title,
      subtitle,
      role,
      timeline,
      thumbnail_url,
      content,
      metrics,
      links,
      is_featured,
      is_published,
      display_order,
      created_at,
      updated_at,
      category_id,
      category:project_categories(id,name,slug),
      tags:project_tags(tag:tags(id,name,slug))
    `
        )
        .order(orderBy, { ascending });

    if (published) {
        query = query.eq("is_published", true);
    }

    if (featured !== undefined) {
        query = query.eq("is_featured", featured);
    }

    if (categorySlug) {
        query = query.eq("category.slug", categorySlug);
    }

    if (limit) {
        query = query.limit(limit);
    }
    if (offset) {
        query = query.range(offset, (offset + (limit || 20)) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    // Transform nested structure to match Project type
    return (data || []).map((project: any) => ({
        ...project,
        category_id: project.category_id || project.category?.[0]?.id || null,
        category: project.category?.[0] || undefined,
        tags: project.tags?.map((pt: { tag: unknown }) => pt.tag) || [],
    }));
}

/**
 * Fetches a single project by slug.
 * Includes related media and tags.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select(
            `
      id,
      slug,
      title,
      subtitle,
      role,
      timeline,
      thumbnail_url,
      content,
      metrics,
      links,
      is_featured,
      is_published,
      display_order,
      created_at,
      updated_at,
      category_id,
      category:project_categories(id,name,slug),
      tags:project_tags(tag:tags(id,name,slug)),
      media:project_media(id,project_id,type,url,alt_text,caption,display_order,created_at)
    `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null; // Not found
        console.error("Error fetching project:", error);
        return null;
    }

    return {
        ...data,
        category: (data.category as any)?.[0] || undefined,
        tags: (data.tags?.map((pt: { tag: unknown }) => pt.tag) || []) as Tag[],
        media: data.media || [],
    };
}

/**
 * Fetches all project slugs for static generation.
 */
export async function getAllProjectSlugs(): Promise<string[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables for getAllProjectSlugs");
        return [];
    }

    const supabase = createSupabaseAnon(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
        .from("projects")
        .select("slug")
        .eq("is_published", true);

    if (error) {
        console.error("Error fetching project slugs:", error);
        return [];
    }

    return (data || []).map((p) => p.slug);
}

/**
 * Fetches all project categories.
 */
export async function getProjectCategories() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("project_categories")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data || [];
}
