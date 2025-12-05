"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const ImageUpload = dynamic(() => import("@/components/admin/image-upload").then((m) => m.ImageUpload), {
    ssr: false,
    loading: () => <div className="w-48 h-32 border-2 border-dashed border-border rounded-lg bg-muted/30 animate-pulse" />,
});
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";
import { RetroInput } from "@/components/admin/ui/retro-input";
import { RetroCard } from "@/components/admin/ui/retro-card";
import { FormAlert } from "@/components/admin/form-alert";

interface ProjectEditFormProps {
    project: Project;
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: project.title,
        slug: project.slug,
        subtitle: project.subtitle || "",
        role: project.role || "",
        timeline: project.timeline || "",
        content: project.content || "",
        thumbnail_url: project.thumbnail_url || "",
        github_url: project.links?.repo || "",
        preview_url: project.links?.demo || "",
        is_published: project.is_published,
        is_featured: project.is_featured,
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
            .from("projects")
            .update({
                title: formData.title,
                slug: formData.slug,
                subtitle: formData.subtitle,
                role: formData.role,
                timeline: formData.timeline,
                content: formData.content,
                thumbnail_url: formData.thumbnail_url,
                is_published: formData.is_published,
                is_featured: formData.is_featured,
                links: {
                    ...project.links,
                    repo: formData.github_url || undefined,
                    demo: formData.preview_url || undefined,
                },
            })
            .eq("id", project.id);

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        router.push("/admin/projects");
        router.refresh();
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setDeleting(true);
        const supabase = createClient();
        const { error: deleteError } = await supabase
            .from("projects")
            .delete()
            .eq("id", project.id);

        if (deleteError) {
            setError(deleteError.message);
            setDeleting(false);
            return;
        }

        router.push("/admin/projects");
        router.refresh();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b-2 border-border pb-6">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-2 uppercase tracking-wider"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Project</h1>
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

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Role</label>
                            <RetroInput
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Timeline</label>
                            <RetroInput
                                type="text"
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Subtitle</label>
                            <RetroInput
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 border-t-2 border-border pt-6">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">GitHub URL</label>
                            <RetroInput
                                type="url"
                                name="github_url"
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/username/repo"
                            />
                            <p className="text-xs text-muted-foreground mt-1 font-mono">Optional</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Preview URL</label>
                            <RetroInput
                                type="url"
                                name="preview_url"
                                value={formData.preview_url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                            <p className="text-xs text-muted-foreground mt-1 font-mono">Optional</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Thumbnail</label>
                        <div className="border-2 border-border p-4 bg-background">
                            <ImageUpload
                                bucket="project-images"
                                path="thumbnails"
                                currentUrl={formData.thumbnail_url}
                                onUpload={(url) =>
                                    setFormData((prev) => ({ ...prev, thumbnail_url: url }))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={15}
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

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${formData.is_featured ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                {formData.is_featured && <div className="w-2 h-2 bg-primary-foreground" />}
                            </div>
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className="text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">Featured</span>
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
