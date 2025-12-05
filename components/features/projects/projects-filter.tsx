"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ALL_CATEGORY = "All";

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface Project {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    content: string;
    thumbnail_url?: string;
    tags: Tag[];
}

interface ProjectsFilterProps {
    projects: Project[];
    tags: string[];
}

export function ProjectsFilter({ projects, tags }: ProjectsFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

    const categories = [ALL_CATEGORY, ...tags];

    const filteredProjects = selectedCategory === ALL_CATEGORY
        ? projects
        : projects.filter((p) => p.tags.some((t) => t.name === selectedCategory));

    return (
        <>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-12">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80 hover:border-border">
                        <div className="relative aspect-video w-full">
                            {project.thumbnail_url ? (
                                <Image
                                    src={project.thumbnail_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={false}
                                />
                            ) : (
                                <div className="aspect-video w-full h-full bg-muted/50" />
                            )}
                        </div>

                        <CardHeader>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {project.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag.id} variant="secondary" className="font-normal">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{project.subtitle}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {project.content.substring(0, 150)}...
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/projects/${project.slug}`}>View Case Study</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No projects found for this category.</p>
                    <Button variant="link" onClick={() => setSelectedCategory(ALL_CATEGORY)}>
                        Clear filter
                    </Button>
                </div>
            )}
        </>
    );
}
