import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectsFilter } from "@/components/features/projects/projects-filter";

export const revalidate = 900;

export default async function ProjectsPage() {
    const supabase = await createClient();

    // Fetch all published projects with their tags
    const { data: projects, error } = await supabase
        .from("projects")
        .select(`
            id,
            slug,
            title,
            subtitle,
            content,
            thumbnail_url,
            project_tags (
                tags (
                    id,
                    name,
                    slug
                )
            )
        `)
        .eq("is_published", true)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching projects:", error);
    }

    // Transform data for display
    const displayProjects = (projects || []).map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        content: project.content,
        thumbnail_url: project.thumbnail_url,
        tags: project.project_tags?.map((pt: any) => ({
            id: pt.tags.id,
            name: pt.tags.name,
            slug: pt.tags.slug,
        })) || [],
    }));

    // Extract unique tags for filtering
    const allTags = Array.from(
        new Set(displayProjects.flatMap((p) => p.tags.map((t) => t.name)))
    ).sort();

    if (error) {
        return (
            <div className="container py-12 md:py-24">
                <div className="max-w-2xl space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Failed to load projects right now. Please try again shortly.
                    </p>
                </div>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="container py-12 md:py-24 space-y-6">
                <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">No projects published yet.</p>
            </div>
        );
    }

    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-start gap-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    A collection of my work in product management, design, and engineering.
                </p>
            </div>

            {/* Client-side filter component */}
            <ProjectsFilter projects={displayProjects} tags={allTags} />
        </div>
    );
}
