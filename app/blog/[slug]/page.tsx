import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/api/posts";

export const revalidate = 900; // ISR: refresh detail every 15 minutes

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const tags = post.tags ?? [];
    const readingTime = Math.ceil((post.content?.length || 0) / 1000); // Rough estimate: 1000 chars = 1 min

    return (
        <article className="container py-12 md:py-24 max-w-4xl">
            {/* Back Link */}
            <div className="mb-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Link>
            </div>

            {/* Header */}
            <div className="space-y-6 mb-12">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
                {post.excerpt && <p className="text-xl text-muted-foreground">{post.excerpt}</p>}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/40">
                    {post.published_at && (
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(post.published_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    )}
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {readingTime} min read
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.cover_image_url && (
                <div className="mb-12 relative aspect-video w-full rounded-lg border-2 border-border/40 overflow-hidden">
                    <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        priority
                    />
                </div>
            )}

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
                prose-hr:border-border/40 prose-hr:my-12">
                {post.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                ) : (
                    <p className="text-muted-foreground">No content available.</p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-border/40">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                >
                    ← Back to all posts
                </Link>
            </div>
        </article>
    );
}
