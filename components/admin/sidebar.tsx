"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Briefcase,
    Wrench,
    Tags,
    MessageSquare,
    LogOut,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { User } from "@supabase/supabase-js";

interface AdminSidebarProps {
    user: User;
}

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
    { href: "/admin/skills", label: "Skills", icon: Wrench },
    { href: "/admin/tags", label: "Tags", icon: Tags },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 hidden h-screen w-64 border-r-2 border-border bg-card lg:block",
            )}
        >
            <div className="flex h-full flex-col">
                <div className="border-b-2 border-border p-6">
                    <div className="flex items-center justify-between">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-xl font-black uppercase tracking-tighter">Admin System</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 border-2 px-3 py-2 text-sm font-mono uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-retro",
                                    isActive
                                        ? "border-primary bg-primary text-primary-foreground shadow-retro"
                                        : "border-transparent text-muted-foreground hover:border-primary hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t-2 border-border p-4">
                    <div className="mb-4 text-xs font-mono text-muted-foreground truncate px-1">
                        LOGGED IN AS:<br />
                        <span className="text-foreground font-bold">{user.email}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-none border-2 border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors uppercase font-mono"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
