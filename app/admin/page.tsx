import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
    FolderKanban,
    FileText,
    Briefcase,
    Wrench,
    MessageSquare,
    ArrowRight,
} from "lucide-react";
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/admin/ui/retro-card";
import { Button } from "@/components/ui/button";

interface StatCardProps {
    title: string;
    count: number;
    href: string;
    icon: React.ReactNode;
    description: string;
}

function StatCard({ title, count, href, icon, description }: StatCardProps) {
    return (
        <Link href={href} className="block group">
            <RetroCard className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-retro-lg border-primary/20 group-hover:border-primary">
                <RetroCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <RetroCardTitle className="text-sm font-medium">
                        {title}
                    </RetroCardTitle>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {icon}
                    </div>
                </RetroCardHeader>
                <RetroCardContent>
                    <div className="text-2xl font-bold font-mono">{count}</div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {description}
                    </p>
                </RetroCardContent>
            </RetroCard>
        </Link>
    );
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [projects, posts, experiences, skills, messages] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
    ]);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-border pb-6">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">System // Overview</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">Dashboard</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="rounded-none border-2 border-primary shadow-retro hover:translate-y-0.5 hover:shadow-none transition-all">
                        <Link href="/admin/projects/new">
                            + New Project
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-none border-2 border-border hover:bg-muted">
                        <Link href="/admin/posts/new">
                            + New Post
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="PROJECTS"
                    count={projects.count || 0}
                    href="/admin/projects"
                    icon={<FolderKanban className="h-5 w-5" />}
                    description="Portfolio items"
                />
                <StatCard
                    title="POSTS"
                    count={posts.count || 0}
                    href="/admin/posts"
                    icon={<FileText className="h-5 w-5" />}
                    description="Blog articles"
                />
                <StatCard
                    title="EXPERIENCES"
                    count={experiences.count || 0}
                    href="/admin/experiences"
                    icon={<Briefcase className="h-5 w-5" />}
                    description="Work history"
                />
                <StatCard
                    title="SKILLS"
                    count={skills.count || 0}
                    href="/admin/skills"
                    icon={<Wrench className="h-5 w-5" />}
                    description="Tech stack"
                />
                <StatCard
                    title="MESSAGES"
                    count={messages.count || 0}
                    href="/admin/messages"
                    icon={<MessageSquare className="h-5 w-5" />}
                    description="Unread inquiries"
                />
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary inline-block" />
                        Quick Actions
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/admin/projects/new"
                        className="group flex items-center justify-between p-4 border-2 border-border bg-card hover:border-primary transition-colors"
                    >
                        <span className="font-mono font-bold uppercase">Create Project</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/admin/posts/new"
                        className="group flex items-center justify-between p-4 border-2 border-border bg-card hover:border-primary transition-colors"
                    >
                        <span className="font-mono font-bold uppercase">Write Post</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="group flex items-center justify-between p-4 border-2 border-border bg-card hover:border-primary transition-colors"
                    >
                        <span className="font-mono font-bold uppercase">View Live Site</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
