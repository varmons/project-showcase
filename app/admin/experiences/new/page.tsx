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

export default function NewExperiencePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        role: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
        display_order: 0,
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

        if (!formData.role || !formData.company) {
            setError("Role and company are required");
            setLoading(false);
            return;
        }

        const supabase = createClient();
        const { error: insertError } = await supabase.from("experiences").insert(formData);

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
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
                <h1 className="text-3xl font-black uppercase tracking-tighter">New Experience</h1>
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
                                placeholder="e.g., Jan 2023"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">End Date</label>
                            <RetroInput
                                type="text"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                placeholder="e.g., Present"
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
                            {loading ? "CREATING..." : "CREATE EXPERIENCE"}
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
