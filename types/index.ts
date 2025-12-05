/**
 * Database Types
 * These types mirror the Supabase database schema.
 * They are used throughout the application for type safety.
 */

// =============================================================================
// Core Entities
// =============================================================================

export interface User {
    id: string;
    display_name: string;
    bio: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    role: string | null;
    timeline: string | null;
    thumbnail_url: string | null;
    content: string | null;
    metrics: string[];
    links: ProjectLinks;
    category_id: string | null;
    is_featured: boolean;
    is_published: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    // Joined relations (optional, populated by queries)
    category?: ProjectCategory;
    tags?: Tag[];
    media?: ProjectMedia[];
    skills?: Skill[];
}

export interface ProjectLinks {
    demo?: string;
    repo?: string;
    figma?: string;
    [key: string]: string | undefined;
}

export interface ProjectMedia {
    id: string;
    project_id: string;
    type: "image" | "video" | "link" | "embed";
    url: string;
    alt_text: string | null;
    caption: string | null;
    display_order: number;
    created_at: string;
}

export interface Skill {
    id: string;
    name: string;
    category: SkillCategory;
    level: SkillLevel | null;
    icon_url: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export type SkillCategory = "Tech" | "Design" | "Product" | "Other";
export type SkillLevel = "Expert" | "Proficient" | "Familiar";

export interface Experience {
    id: string;
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    description: string | null;
    achievements: string[];
    logo_url: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image_url: string | null;
    published_at: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    // Joined relations
    tags?: Tag[];
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

// =============================================================================
// Input Types (for forms and mutations)
// =============================================================================

export interface ContactMessageInput {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export interface ProjectInput {
    slug: string;
    title: string;
    subtitle?: string;
    role?: string;
    timeline?: string;
    thumbnail_url?: string;
    content?: string;
    metrics?: string[];
    links?: ProjectLinks;
    category_id?: string;
    is_featured?: boolean;
    is_published?: boolean;
    display_order?: number;
}

export interface PostInput {
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    cover_image_url?: string;
    is_published?: boolean;
    published_at?: string;
}

export interface ExperienceInput {
    company: string;
    role: string;
    start_date: string;
    end_date?: string;
    description?: string;
    achievements?: string[];
    logo_url?: string;
    display_order?: number;
}

export interface SkillInput {
    name: string;
    category: SkillCategory;
    level?: SkillLevel;
    icon_url?: string;
    display_order?: number;
}

export interface TagInput {
    name: string;
    slug: string;
}

export interface ProjectCategoryInput {
    name: string;
    slug: string;
    description?: string;
    display_order?: number;
}

// =============================================================================
// Query Options
// =============================================================================

export interface ProjectQueryOptions {
    categorySlug?: string;
    tagSlug?: string;
    featured?: boolean;
    published?: boolean;
    limit?: number;
    offset?: number;
    orderBy?: "created_at" | "display_order" | "title" | "published_at";
    ascending?: boolean;
}

export interface PostQueryOptions {
    tagSlug?: string;
    published?: boolean;
    limit?: number;
    offset?: number;
    orderBy?: "published_at" | "created_at" | "title";
}
