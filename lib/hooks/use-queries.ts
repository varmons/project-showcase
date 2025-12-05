"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
    Project,
    Experience,
    Skill,
    Post,
    Tag,
    ProjectQueryOptions,
    ContactMessageInput,
} from "@/types";

// =============================================================================
// Query Keys
// =============================================================================

export const queryKeys = {
    projects: {
        all: ["projects"] as const,
        list: (options?: ProjectQueryOptions) =>
            [...queryKeys.projects.all, "list", options] as const,
        detail: (slug: string) =>
            [...queryKeys.projects.all, "detail", slug] as const,
        categories: ["projects", "categories"] as const,
    },
    experiences: {
        all: ["experiences"] as const,
    },
    skills: {
        all: ["skills"] as const,
        byCategory: ["skills", "byCategory"] as const,
    },
    posts: {
        all: ["posts"] as const,
        detail: (slug: string) => [...queryKeys.posts.all, "detail", slug] as const,
    },
    tags: {
        all: ["tags"] as const,
        forProjects: ["tags", "forProjects"] as const,
    },
};

// =============================================================================
// Projects Hooks
// =============================================================================

export function useProjects(options?: ProjectQueryOptions) {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.projects.list(options),
        queryFn: async (): Promise<Project[]> => {
            const {
                featured,
                published = true,
                limit,
                orderBy = "display_order",
                ascending = true,
            } = options || {};

            let query = supabase
                .from("projects")
                .select(
                    `
          *,
          category:project_categories(*),
          tags:project_tags(tag:tags(*))
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

            const { data, error } = await query;

            if (error) throw error;

            return (data || []).map((project) => ({
                ...project,
                tags: project.tags?.map((pt: { tag: Tag }) => pt.tag) || [],
            }));
        },
    });
}

export function useProject(slug: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.projects.detail(slug),
        queryFn: async (): Promise<Project | null> => {
            const { data, error } = await supabase
                .from("projects")
                .select(
                    `
          *,
          category:project_categories(*),
          tags:project_tags(tag:tags(*)),
          media:project_media(*)
        `
                )
                .eq("slug", slug)
                .eq("is_published", true)
                .single();

            if (error) {
                if (error.code === "PGRST116") return null;
                throw error;
            }

            return {
                ...data,
                tags: data.tags?.map((pt: { tag: Tag }) => pt.tag) || [],
                media: data.media || [],
            };
        },
        enabled: !!slug,
    });
}

export function useProjectCategories() {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.projects.categories,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("project_categories")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data || [];
        },
    });
}

// =============================================================================
// Experiences Hook
// =============================================================================

export function useExperiences() {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.experiences.all,
        queryFn: async (): Promise<Experience[]> => {
            const { data, error } = await supabase
                .from("experiences")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data || [];
        },
    });
}

// =============================================================================
// Skills Hooks
// =============================================================================

export function useSkills() {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.skills.all,
        queryFn: async (): Promise<Skill[]> => {
            const { data, error } = await supabase
                .from("skills")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data || [];
        },
    });
}

// =============================================================================
// Posts Hooks
// =============================================================================

export function usePosts() {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.posts.all,
        queryFn: async (): Promise<Post[]> => {
            const { data, error } = await supabase
                .from("posts")
                .select(
                    `
          *,
          tags:post_tags(tag:tags(*))
        `
                )
                .eq("is_published", true)
                .order("published_at", { ascending: false });

            if (error) throw error;

            return (data || []).map((post) => ({
                ...post,
                tags: post.tags?.map((pt: { tag: Tag }) => pt.tag) || [],
            }));
        },
    });
}

export function usePost(slug: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.posts.detail(slug),
        queryFn: async (): Promise<Post | null> => {
            const { data, error } = await supabase
                .from("posts")
                .select(
                    `
          *,
          tags:post_tags(tag:tags(*))
        `
                )
                .eq("slug", slug)
                .eq("is_published", true)
                .single();

            if (error) {
                if (error.code === "PGRST116") return null;
                throw error;
            }

            return {
                ...data,
                tags: data.tags?.map((pt: { tag: Tag }) => pt.tag) || [],
            };
        },
        enabled: !!slug,
    });
}

// =============================================================================
// Tags Hook
// =============================================================================

export function useTags() {
    const supabase = createClient();

    return useQuery({
        queryKey: queryKeys.tags.all,
        queryFn: async (): Promise<Tag[]> => {
            const { data, error } = await supabase
                .from("tags")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            return data || [];
        },
    });
}

// =============================================================================
// Contact Form Mutation
// =============================================================================

export function useContactForm() {
    const supabase = createClient();

    return useMutation({
        mutationFn: async (input: ContactMessageInput) => {
            const { error } = await supabase.from("contact_messages").insert({
                name: input.name,
                email: input.email,
                subject: input.subject || null,
                message: input.message,
            });

            if (error) throw error;
            return { success: true };
        },
    });
}
