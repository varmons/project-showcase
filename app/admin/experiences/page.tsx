import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/admin/ui/retro-card";

export default async function AdminExperiencesPage() {
    const supabase = await createClient();

    const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-border pb-6">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Database // Experiences</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Experiences</h1>
                </div>
                <Button asChild className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Link href="/admin/experiences/new">
                        <Plus className="mr-2 h-4 w-4" />
                        NEW EXPERIENCE
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {experiences?.map((exp) => (
                    <RetroCard key={exp.id} className="border-2">
                        <div className="flex justify-between items-start p-6">
                            <div>
                                <h3 className="font-bold font-mono text-lg uppercase tracking-wide">{exp.role}</h3>
                                <p className="text-primary font-mono font-medium">{exp.company}</p>
                                <p className="text-sm text-muted-foreground mt-1 font-mono">
                                    {exp.start_date} - {exp.end_date}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="hover:bg-muted rounded-none">
                                <Link href={`/admin/experiences/${exp.id}/edit`}>
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </RetroCard>
                ))}

                {(!experiences || experiences.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground font-mono border-2 border-dashed border-border p-8">
                        No experiences recorded. Initialize first entry.
                    </div>
                )}
            </div>
        </div>
    );
}
