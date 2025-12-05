import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import type { Skill } from "@/types";
import { RetroCard } from "@/components/admin/ui/retro-card";

export default async function AdminSkillsPage() {
    const supabase = await createClient();

    const { data: skills } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true });

    const groupedSkills = (skills || []).reduce<Record<string, Skill[]>>(
        (acc, skill) => {
            const category = skill.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill as Skill);
            return acc;
        },
        {}
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b-2 border-border pb-6">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Database // Skills</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Skills</h1>
                </div>
                <Button asChild className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Link href="/admin/skills/new">
                        <Plus className="mr-2 h-4 w-4" />
                        NEW SKILL
                    </Link>
                </Button>
            </div>

            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary inline-block" />
                        {category}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categorySkills.map((skill) => (
                            <RetroCard
                                key={skill.id}
                                className="p-4 flex justify-between items-center hover:border-primary transition-colors"
                            >
                                <div>
                                    <p className="font-bold font-mono uppercase">{skill.name}</p>
                                    {skill.level && (
                                        <Badge variant="secondary" className="mt-1 rounded-none border border-border font-mono text-[10px] uppercase">
                                            {skill.level}
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" asChild className="hover:bg-muted rounded-none">
                                    <Link href={`/admin/skills/${skill.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </RetroCard>
                        ))}
                    </div>
                </div>
            ))}

            {(!skills || skills.length === 0) && (
                <div className="text-center py-12 text-muted-foreground font-mono border-2 border-dashed border-border p-8">
                    No skills recorded. Initialize first entry.
                </div>
            )}
        </div>
    );
}
