import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAnon } from "@supabase/supabase-js";

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image_url?: string;
    is_published: boolean;
    is_featured: boolean;
    published_at?: string;
    display_order: number;
    created_at: string;
    updated_at: string;
    tags?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

export interface PostQueryOptions {
    tagSlug?: string;
    featured?: boolean;
    published?: boolean;
    limit?: number;
    offset?: number;
    orderBy?: string;
    ascending?: boolean;
}

/**
 * Fetches all published posts with optional filtering.
 * Used in server components for initial page load.
 */
export async function getPosts(
    options: PostQueryOptions = {}
): Promise<Post[]> {
    const supabase = await createClient();

    const {
        tagSlug,
        featured,
        published = true,
        limit,
        offset,
        orderBy = "published_at",
        ascending = false,
    } = options;

    let query = supabase
        .from("posts")
        .select(
            `
            id,
            slug,
            title,
            excerpt,
            content,
            cover_image_url,
            published_at,
            is_published,
            is_featured,
            display_order,
            created_at,
            updated_at,
            post_tags ( tag:tags ( id, name, slug ) )
        `
        )
        .order(orderBy, { ascending });

    if (published) {
        query = query.eq("is_published", true);
    }

    if (featured !== undefined) {
        query = query.eq("is_featured", featured);
    }

    if (limit) {
        query = query.limit(limit);
    }
    if (offset) {
        query = query.range(offset, (offset + (limit || 20)) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    // Transform nested tags structure
    let posts = (data || []).map((post) => ({
        ...post,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tags: (post as any).post_tags?.map((pt: any) => pt.tag || pt.tags).filter(Boolean) || [],
    }));

    if (tagSlug) {
        posts = posts.filter((post) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            post.tags?.some((t: any) => t.slug === tagSlug)
        );
    }

    return posts;
}

/**
 * Fetches a single post by slug.
 * Includes related tags.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select(
            `
            id,
            slug,
            title,
            excerpt,
            content,
            cover_image_url,
            published_at,
            is_published,
            is_featured,
            display_order,
            created_at,
            updated_at,
            post_tags ( tag:tags ( id, name, slug ) )
        `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null; // Not found
        console.error("Error fetching post:", error);
        return null;
    }

    return {
        ...data,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tags: (data as any).post_tags?.map((pt: any) => pt.tag || pt.tags).filter(Boolean) || [],
    } as Post;
}

/**
 * Fetches all post slugs for static generation.
 */
export async function getAllPostSlugs(): Promise<string[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables for getAllPostSlugs");
        return [];
    }

    const supabase = createSupabaseAnon(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
        .from("posts")
        .select("slug")
        .eq("is_published", true);

    if (error) {
        console.error("Error fetching post slugs:", error);
        return [];
    }

    return (data || []).map((p) => p.slug);
}

/**
 * Fetches featured posts for homepage or sidebar
 */
export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
    return getPosts({
        featured: true,
        limit,
        orderBy: "published_at",
        ascending: false,
    });
}
