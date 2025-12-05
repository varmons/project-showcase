"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

interface NavbarProps {
    siteName?: string;
}

export function Navbar({ siteName = siteConfig.name }: NavbarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="mr-4 hidden md:flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2 group">
                        <div className="h-6 w-6 bg-primary animate-pulse mr-2" />
                        <span className="hidden font-bold sm:inline-block tracking-widest uppercase group-hover:text-primary transition-colors">
                            {siteName}
                        </span>
                    </Link>
                    <nav className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
                        {siteConfig.nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 transition-colors hover:text-primary hover:bg-primary/10 border-b-2 border-transparent",
                                    pathname === item.href
                                        ? "text-primary border-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Mobile Menu Button & Theme Toggle */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none flex items-center justify-end gap-4">
                        {/* Status Indicator */}
                        <div className="hidden md:flex items-center space-x-2 text-xs text-primary font-mono">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span>SYSTEM ONLINE</span>
                        </div>
                        <ThemeToggle />
                    </div>

                    <Button
                        variant="ghost"
                        className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="container md:hidden px-4 pb-4 border-b-2 border-border bg-background">
                    <div className="flex flex-col space-y-2 mt-4">
                        {siteConfig.nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-base font-bold uppercase tracking-wider px-4 py-3 border-l-4 transition-all hover:bg-primary/10 hover:text-primary",
                                    pathname === item.href
                                        ? "text-primary border-primary bg-primary/5"
                                        : "text-muted-foreground border-transparent"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
