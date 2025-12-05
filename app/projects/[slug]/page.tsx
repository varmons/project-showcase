import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/api/projects";

export const revalidate = 900; // ISR: refresh detail every 15 minutes

interface ProjectPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const slugs = await getAllProjectSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    const tags = project.tags ?? [];
    const metrics = project.metrics ?? [];
    const links = project.links ?? {};

    return (
        <article className="container py-12 md:py-24 max-w-4xl">
            {/* Back Link */}
            <div className="mb-8">
                <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
            </div>

            {/* Header */}
            <div className="space-y-6 mb-12">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag.id ?? tag.slug ?? tag.name} variant="secondary">
                            {"name" in tag ? tag.name : String(tag)}
                        </Badge>
                    ))}
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{project.title}</h1>
                {project.subtitle && <p className="text-xl text-muted-foreground">{project.subtitle}</p>}

                <div className="flex flex-wrap gap-4 pt-4">
                    {links.demo && (
                        <Button asChild>
                            <a href={links.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                        </Button>
                    )}
                    {links.repo && (
                        <Button asChild variant="outline">
                            <a href={links.repo} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> View Code
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/40 mb-12">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
                    <p className="font-medium">{project.role || "—"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h3>
                    <p className="font-medium">{project.timeline || "—"}</p>
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Key Metrics</h3>
                    {metrics.length > 0 ? (
                        <ul className="list-disc list-inside text-sm">
                            {metrics.map((metric, i) => (
                                <li key={i}>{metric}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No metrics provided.</p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {project.content || "No project description yet."}
                </p>

                {/* Placeholder for more content structure */}
                <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">The Challenge</h2>
                <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">The Solution</h2>
                <p className="text-muted-foreground">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <div className="my-12 aspect-video w-full bg-muted/30 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground">
                    Project Screenshot / Demo Video Placeholder
                </div>
            </div>
        </article>
    );
}
