"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { RetroInput } from "@/components/admin/ui/retro-input";
import { RetroCard } from "@/components/admin/ui/retro-card";
import { FormAlert } from "@/components/admin/form-alert";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    is_published: boolean;
    published_at: string | null;
}

interface PostEditFormProps {
    post: Post;
}

export function PostEditForm({ post }: PostEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        is_published: post.is_published,
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error: updateError } = await supabase
            .from("posts")
            .update({
                ...formData,
                published_at: formData.is_published
                    ? post.published_at || new Date().toISOString()
                    : null,
            })
            .eq("id", post.id);

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        router.push("/admin/posts");
        router.refresh();
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setDeleting(true);
        const supabase = createClient();
        const { error: deleteError } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id);

        if (deleteError) {
            setError(deleteError.message);
            setDeleting(false);
            return;
        }

        router.push("/admin/posts");
        router.refresh();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b-2 border-border pb-6">
                <Link
                    href="/admin/posts"
                    className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-2 uppercase tracking-wider"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Posts
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Post</h1>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-none border-2 border-destructive shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all font-mono uppercase"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleting ? "DELETING..." : "DELETE"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <FormAlert message={error} />

                <RetroCard className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Title *</label>
                            <RetroInput
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Slug *</label>
                            <RetroInput
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Excerpt</label>
                        <RetroInput
                            type="text"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={20}
                            className="w-full px-4 py-3 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-none resize-y"
                        />
                    </div>

                    <div className="flex gap-8 border-t-2 border-border pt-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${formData.is_published ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                {formData.is_published && <div className="w-2 h-2 bg-primary-foreground" />}
                            </div>
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className="text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">Published</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                            {loading ? "SAVING..." : "SAVE CHANGES"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="rounded-none border-2 border-border hover:bg-muted"
                        >
                            CANCEL
                        </Button>
                    </div>
                </RetroCard>
            </form>
        </div>
    );
}
