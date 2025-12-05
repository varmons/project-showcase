import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";

/**
 * Flexible project type that works with both mock data and Supabase data
 */
interface DisplayProject {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    content?: string | null;
    thumbnail_url?: string | null;
    tags?: string[] | { id: string; name: string }[];
}

interface FeaturedProjectsProps {
    projects: DisplayProject[];
}

/**
 * Helper to get tag names from either string[] or Tag[] format
 */
function getTagNames(tags?: string[] | { id: string; name: string }[]): string[] {
    if (!tags || tags.length === 0) return [];
    if (typeof tags[0] === "string") {
        return tags as string[];
    }
    return (tags as { id: string; name: string }[]).map(t => t.name);
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
    return (
        <section className="container py-12 md:py-24 lg:py-32 border-t-2 border-border border-dashed">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-16">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Cpu className="h-6 w-6" />
                        <h2 className="text-3xl font-bold tracking-widest uppercase">Selected_Works</h2>
                    </div>
                    <p className="text-muted-foreground font-mono pl-8 border-l-2 border-border">
            // A selection of recent engineering outputs.
                    </p>
                </div>
                <Button asChild variant="outline" className="border-dashed">
                    <Link href="/projects" className="group">
                        Access All Archives
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                    const tagNames = getTagNames(project.tags);
                    return (
                        <Card key={project.id} className="group hover:border-primary transition-colors duration-300">
                            <div className="aspect-video w-full bg-secondary/30 object-cover border-b-2 border-border group-hover:border-primary/50 transition-colors flex items-center justify-center relative overflow-hidden">
                                {project.thumbnail_url ? (
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <>
                                        {/* Scanline overlay for image placeholder */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                                        <span className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Image_Data_Missing</span>
                                    </>
                                )}
                            </div>

                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tagNames.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2 font-mono text-xs mt-2">{project.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3 font-mono border-l-2 border-primary/20 pl-4">
                                    {(project.content || "").substring(0, 150)}...
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="default" className="w-full">
                                    <Link href={`/projects/${project.slug}`}>Execute Case Study</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
