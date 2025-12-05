"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RetroInput } from "@/components/admin/ui/retro-input";
import { RetroCard } from "@/components/admin/ui/retro-card";
import { FormAlert } from "@/components/admin/form-alert";

export default function NewTagPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.name || !formData.slug) {
            setError("Name and slug are required");
            setLoading(false);
            return;
        }

        const supabase = createClient();
        const { error: insertError } = await supabase.from("tags").insert(formData);

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        router.push("/admin/tags");
        router.refresh();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b-2 border-border pb-6">
                <Link
                    href="/admin/tags"
                    className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-2 uppercase tracking-wider"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tags
                </Link>
                <h1 className="text-3xl font-black uppercase tracking-tighter">New Tag</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <FormAlert message={error} />

                <RetroCard className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Name *</label>
                            <RetroInput
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (!formData.slug) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            slug: generateSlug(e.target.value),
                                        }));
                                    }
                                }}
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

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                            {loading ? "CREATING..." : "CREATE TAG"}
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
