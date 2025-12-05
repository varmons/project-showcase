import Link from "next/link";
import { getPosts } from "@/lib/api/posts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
    const posts = await getPosts({
        published: true,
        orderBy: "published_at",
        ascending: false,
    });

    return (
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-start gap-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Thoughts on product management, design, and engineering.
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Card
                            key={post.id}
                            className="flex flex-col overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80 hover:border-border"
                        >
                            {post.cover_image_url && (
                                <img
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    className="aspect-video w-full object-cover"
                                />
                            )}

                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.tags?.slice(0, 3).map((tag) => (
                                        <Badge key={tag.id} variant="secondary" className="font-normal">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {post.published_at && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(post.published_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={`/blog/${post.slug}`}>Read Article</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
