"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
    reset,
}: {
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-lg space-y-6 text-center border-2 border-border bg-card p-8 shadow-retro">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Admin // Error</p>
                <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard Fault</h1>
                <p className="text-muted-foreground">
                    Something went wrong while loading the admin dashboard. Try again or return to the main site.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button onClick={reset}>Retry</Button>
                    <Button asChild variant="outline">
                        <Link href="/">Back Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
