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

interface Experience {
    id: string;
    role: string;
    company: string;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    display_order: number;
}

interface ExperienceEditFormProps {
    experience: Experience;
}

export function ExperienceEditForm({ experience }: ExperienceEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        role: experience.role,
        company: experience.company,
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        description: experience.description || "",
        display_order: experience.display_order,
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "display_order" ? parseInt(value) || 0 : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error: updateError } = await supabase
            .from("experiences")
            .update(formData)
            .eq("id", experience.id);

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        router.push("/admin/experiences");
        router.refresh();
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this experience?")) return;

        setDeleting(true);
        const supabase = createClient();
        const { error: deleteError } = await supabase
            .from("experiences")
            .delete()
            .eq("id", experience.id);

        if (deleteError) {
            setError(deleteError.message);
            setDeleting(false);
            return;
        }

        router.push("/admin/experiences");
        router.refresh();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b-2 border-border pb-6">
                <Link
                    href="/admin/experiences"
                    className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-2 uppercase tracking-wider"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Experiences
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Experience</h1>
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
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Role *</label>
                            <RetroInput
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Company *</label>
                            <RetroInput
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Start Date</label>
                            <RetroInput
                                type="text"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">End Date</label>
                            <RetroInput
                                type="text"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Display Order</label>
                            <RetroInput
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-none resize-y"
                        />
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
