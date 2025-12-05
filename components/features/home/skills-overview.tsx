import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

/**
 * Flexible skill type that works with both mock data and Supabase data
 */
interface DisplaySkill {
    name: string;
    category: string;
    level?: string | null;
}

interface SkillsOverviewProps {
    skills: DisplaySkill[];
}

export function SkillsOverview({ skills }: SkillsOverviewProps) {
    // Group skills by category
    const categories = Array.from(new Set(skills.map((s) => s.category)));

    return (
        <section className="container py-12 md:py-24 border-t-2 border-border border-dashed">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Database className="h-6 w-6" />
                        <h2 className="text-3xl font-bold tracking-widest uppercase">Tech_Specs</h2>
                    </div>
                    <p className="text-muted-foreground font-mono pl-8 border-l-2 border-border">
            // Tools and technologies currently loaded in memory.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-3 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <div key={category} className="space-y-4 border-2 border-border p-6 bg-secondary/5 relative">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>

                            <h3 className="font-bold text-lg uppercase tracking-wider text-primary border-b-2 border-border/50 pb-2 mb-4 inline-block">
                                {category}_Module
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills
                                    .filter((s) => s.category === category)
                                    .map((skill) => (
                                        <Badge key={skill.name} variant="outline" className="px-3 py-1 hover:bg-primary hover:text-primary-foreground cursor-default">
                                            {skill.name}
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
