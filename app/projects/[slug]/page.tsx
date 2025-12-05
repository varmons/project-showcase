import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/api/projects";

export const revalidate = 900; // ISR: refresh detail every 15 minutes

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const slugs = await getAllProjectSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const tags = project.tags ?? [];
    const metrics = project.metrics ?? [];
    const links = project.links ?? {};
    const media = project.media ?? [];

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

            {/* Content - Markdown Support */}
            <div className="prose dark:prose-invert prose-lg max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:border-b prose-h1:border-border/40 prose-h1:pb-4
                prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-10 
                prose-h3:text-3xl prose-h3:mb-4 prose-h3:mt-8
                prose-h4:text-2xl prose-h4:mb-3 prose-h4:mt-6
                prose-h5:text-xl prose-h5:mb-2 prose-h5:mt-4
                prose-h6:text-lg prose-h6:mb-2 prose-h6:mt-4
                prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-secondary/30 prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:my-2 prose-li:text-base prose-li:marker:text-primary
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:bg-secondary/20
                prose-img:rounded-lg prose-img:border prose-img:border-border/40 prose-img:my-8
                prose-hr:border-border/40 prose-hr:my-12
                mb-12">
                {project.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {project.content}
                    </ReactMarkdown>
                ) : (
                    <p className="text-muted-foreground">No project description yet.</p>
                )}
            </div>

            {/* Project Images - Show thumbnail or media gallery */}
            {(project.thumbnail_url || media.length > 0) && (
                <div className="space-y-8 mb-12">
                    <h2 className="text-2xl font-bold border-b border-border/40 pb-4">Project Images</h2>
                    <div className="grid gap-8">
                        {/* Show thumbnail if no media gallery exists */}
                        {media.length === 0 && project.thumbnail_url && (
                            <div className="space-y-4">
                                <div className="relative w-full aspect-video rounded-lg border-2 border-border/40 overflow-hidden bg-secondary/30 group">
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Show media gallery if exists */}
                        {media.length > 0 && media.map((item) => (
                            <div key={item.id} className="space-y-4">
                                <div className="relative w-full aspect-video rounded-lg border-2 border-border/40 overflow-hidden bg-secondary/30 group">
                                    <Image
                                        src={item.url}
                                        alt={item.alt_text || project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                    />
                                </div>
                                {item.caption && (
                                    <p className="text-sm text-muted-foreground text-center font-mono border-l-2 border-primary/20 pl-4">
                                        {item.caption}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
