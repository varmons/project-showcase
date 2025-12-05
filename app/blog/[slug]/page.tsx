import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/api/posts";

export const revalidate = 900; // ISR: refresh detail every 15 minutes

interface PostPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PostPageProps) {
    const post = await getPostBySlug(params.slug);

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
                <div className="mb-12">
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full aspect-video object-cover rounded-lg border border-border/40"
                    />
                </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none">
                <div
                    className="whitespace-pre-wrap leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content || "No content available." }}
                />
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
