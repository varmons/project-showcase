/**
 * Legacy Mock Data Types
 * These types maintain backward compatibility with existing mock data.
 * Use these for local development until Supabase data migration is complete.
 */

export interface MockProject {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    role: string;
    timeline: string;
    tags: string[];
    thumbnail: string;
    content: string;
    metrics?: string[];
    links?: {
        demo?: string;
        repo?: string;
    };
}

export interface MockExperience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | "Present";
    description: string;
    achievements: string[];
    logo?: string;
}

export interface MockSkill {
    name: string;
    category: "Product" | "Design" | "Tech" | "Other";
    level?: "Expert" | "Proficient" | "Familiar";
}

export interface MockPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    content: string;
}
