"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    MessageSquare,
    Menu,
    Briefcase,
    Wrench,
    Tags,
    LogOut,
    X,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { User } from "@supabase/supabase-js";

interface MobileNavProps {
    user: User;
}

export function MobileNav({ user }: MobileNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const mainNavItems = [
        { href: "/admin", label: "Dash", icon: LayoutDashboard },
        { href: "/admin/projects", label: "Projs", icon: FolderKanban },
        { href: "/admin/posts", label: "Posts", icon: FileText },
        { href: "/admin/messages", label: "Msgs", icon: MessageSquare },
    ];

    const secondaryNavItems = [
        { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
        { href: "/admin/skills", label: "Skills", icon: Wrench },
        { href: "/admin/tags", label: "Tags", icon: Tags },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
        setIsMenuOpen(false);
    }

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-background lg:hidden pb-[env(safe-area-inset-bottom)]">
                <nav className="flex items-stretch h-16">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-1 border-r border-border last:border-r-0 active:bg-muted transition-colors",
                                    isActive && "bg-primary text-primary-foreground"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                    <button
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center gap-1 border-l border-border active:bg-muted transition-colors",
                            isMenuOpen && "bg-muted"
                        )}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                            Menu
                        </span>
                    </button>
                </nav>
            </div>

            {/* More Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm lg:hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200 pb-[calc(4rem+env(safe-area-inset-bottom))]">
                    <div className="flex items-center justify-between p-4 border-b-2 border-border bg-card">
                        <span className="text-lg font-black uppercase tracking-tighter">System Menu</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-none border-2 border-border"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-mono uppercase text-muted-foreground mb-2">Database</h3>
                            {secondaryNavItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 border-2 p-3 text-sm font-mono uppercase tracking-wider transition-all active:scale-[0.98]",
                                            isActive
                                                ? "border-primary bg-primary text-primary-foreground shadow-retro"
                                                : "border-border bg-card text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="space-y-4 pt-4 border-t-2 border-border">
                            <div className="flex items-center justify-between p-3 border-2 border-border bg-muted/20">
                                <span className="font-mono text-sm uppercase">Theme</span>
                                <ThemeToggle />
                            </div>

                            <div className="text-center">
                                <p className="text-xs font-mono text-muted-foreground mb-1">LOGGED IN AS</p>
                                <p className="font-mono font-bold text-sm truncate">{user.email}</p>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-none border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground uppercase font-mono font-bold"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
