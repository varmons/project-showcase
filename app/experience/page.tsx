import { createClient } from "@/lib/supabase/server";

export const revalidate = 900;

export default async function ExperiencePage() {
    const supabase = await createClient();

    // Fetch all experiences (no is_published filter since the column doesn't exist)
    const { data: experiences, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });

    if (error) {
        console.error("Error fetching experiences:", error);
    }

    // Parse achievements JSON
    const displayExperiences = (experiences || []).map((exp) => ({
        ...exp,
        achievements: exp.achievements || [],
    }));

    return (
        <div className="container py-12 md:py-24 max-w-3xl">
            <div className="flex flex-col items-start gap-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Experience</h1>
                <p className="text-xl text-muted-foreground">
                    My professional journey and key contributions.
                </p>
            </div>

            {displayExperiences.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No experience entries yet.</p>
                </div>
            ) : (
                <div className="relative border-l border-border/50 ml-3 md:ml-6 space-y-12 pb-12">
                    {displayExperiences.map((exp) => (
                        <div key={exp.id} className="relative pl-8 md:pl-12">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                            <div className="flex flex-col gap-2 mb-2">
                                <span className="text-sm text-muted-foreground font-mono">
                                    {exp.start_date} - {exp.end_date || "Present"}
                                </span>
                                <h2 className="text-2xl font-bold">{exp.role}</h2>
                                <div className="text-lg font-medium text-foreground/80">
                                    {exp.company}
                                </div>
                            </div>

                            <div className="mt-4 text-muted-foreground leading-relaxed">
                                <p className="mb-4">{exp.description}</p>

                                {exp.achievements && exp.achievements.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                            Key Achievements
                                        </h4>
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-sm">
                                            {exp.achievements.map((achievement: string, i: number) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
