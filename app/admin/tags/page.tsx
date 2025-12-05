import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteTagButton } from "./delete-button";
import { RetroCard } from "@/components/admin/ui/retro-card";

interface TagWithRelations {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    projects: { project_id: string }[] | null;
    posts: { post_id: string }[] | null;
}

export default async function AdminTagsPage() {
    const supabase = await createClient();

    const { data: tags } = await supabase
        .from("tags")
        .select(`
            *,
            projects:project_tags(project_id),
            posts:post_tags(post_id)
        `)
        .order("name", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-border pb-6">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Database // Tags</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Tags</h1>
                </div>
                <Button asChild className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Link href="/admin/tags/new">
                        <Plus className="mr-2 h-4 w-4" />
                        NEW TAG
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(tags as TagWithRelations[] | null)?.map((tag) => {
                    const projectCount = tag.projects?.length || 0;
                    const postCount = tag.posts?.length || 0;

                    return (
                        <RetroCard
                            key={tag.id}
                            className="p-4 hover:border-primary transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold font-mono uppercase">{tag.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        /{tag.slug}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {projectCount > 0 && (
                                            <Badge variant="secondary" className="rounded-none border border-border font-mono text-[10px] uppercase">
                                                {projectCount} project{projectCount > 1 ? "s" : ""}
                                            </Badge>
                                        )}
                                        {postCount > 0 && (
                                            <Badge variant="secondary" className="rounded-none border border-border font-mono text-[10px] uppercase">
                                                {postCount} post{postCount > 1 ? "s" : ""}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" asChild className="hover:bg-muted rounded-none">
                                        <Link href={`/admin/tags/${tag.id}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {projectCount === 0 && postCount === 0 && (
                                        <DeleteTagButton tagId={tag.id} />
                                    )}
                                </div>
                            </div>
                        </RetroCard>
                    );
                })}
            </div>

            {(!tags || tags.length === 0) && (
                <div className="text-center py-12 text-muted-foreground font-mono border-2 border-dashed border-border p-8">
                    No tags recorded. Initialize first entry.
                </div>
            )}
        </div>
    );
}
