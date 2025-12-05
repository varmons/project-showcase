import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import {
    RetroTable,
    RetroTableHeader,
    RetroTableBody,
    RetroTableHead,
    RetroTableRow,
    RetroTableCell,
} from "@/components/admin/ui/retro-table";
import { RetroCard } from "@/components/admin/ui/retro-card";

export default async function AdminProjectsPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("id, title, slug, is_published, is_featured, created_at")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-border pb-6 gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Database // Projects</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Projects</h1>
                </div>
                <Button asChild className="w-full sm:w-auto rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Link href="/admin/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        NEW PROJECT
                    </Link>
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <RetroTable>
                    <RetroTableHeader>
                        <RetroTableRow>
                            <RetroTableHead>Title</RetroTableHead>
                            <RetroTableHead>Status</RetroTableHead>
                            <RetroTableHead>Created</RetroTableHead>
                            <RetroTableHead className="text-right">Actions</RetroTableHead>
                        </RetroTableRow>
                    </RetroTableHeader>
                    <RetroTableBody>
                        {projects?.map((project) => (
                            <RetroTableRow key={project.id}>
                                <RetroTableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold font-mono uppercase">{project.title}</span>
                                        {project.is_featured && (
                                            <Badge variant="secondary" className="rounded-none border border-border font-mono text-[10px] uppercase">Featured</Badge>
                                        )}
                                    </div>
                                </RetroTableCell>
                                <RetroTableCell>
                                    <Badge
                                        variant={project.is_published ? "default" : "outline"}
                                        className="rounded-none border border-border font-mono text-[10px] uppercase"
                                    >
                                        {project.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </RetroTableCell>
                                <RetroTableCell className="text-muted-foreground font-mono text-xs">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </RetroTableCell>
                                <RetroTableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild className="hover:bg-muted rounded-none">
                                            <Link href={`/projects/${project.slug}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild className="hover:bg-muted rounded-none">
                                            <Link href={`/admin/projects/${project.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </RetroTableCell>
                            </RetroTableRow>
                        ))}
                        {(!projects || projects.length === 0) && (
                            <RetroTableRow>
                                <RetroTableCell colSpan={4} className="py-8 text-center text-muted-foreground font-mono">
                                    No projects found in database.
                                </RetroTableCell>
                            </RetroTableRow>
                        )}
                    </RetroTableBody>
                </RetroTable>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {projects?.map((project) => (
                    <RetroCard key={project.id} className="p-4 border-2">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <h3 className="font-bold font-mono uppercase text-lg">{project.title}</h3>
                                    {project.is_featured && (
                                        <Badge variant="secondary" className="rounded-none border border-border font-mono text-[10px] uppercase">Featured</Badge>
                                    )}
                                </div>
                                <Badge
                                    variant={project.is_published ? "default" : "outline"}
                                    className="rounded-none border border-border font-mono text-[10px] uppercase"
                                >
                                    {project.is_published ? "Published" : "Draft"}
                                </Badge>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" asChild className="hover:bg-muted rounded-none h-8 w-8">
                                    <Link href={`/projects/${project.slug}`} target="_blank">
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="hover:bg-muted rounded-none h-8 w-8">
                                    <Link href={`/admin/projects/${project.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono border-t border-border pt-2 mt-2">
                            Created: {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </RetroCard>
                ))}
                {(!projects || projects.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground font-mono border-2 border-dashed border-border p-8">
                        No projects found in database.
                    </div>
                )}
            </div>
        </div>
    );
}
