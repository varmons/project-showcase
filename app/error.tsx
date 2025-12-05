"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error boundary captured:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
                <div className="max-w-md space-y-6 text-center border-2 border-border bg-card p-8 shadow-retro">
                    <div className="text-4xl font-black uppercase tracking-widest">System Fault</div>
                    <p className="text-muted-foreground">
                        Something went wrong while rendering this page. You can try again or return home.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button onClick={reset} className="w-full sm:w-auto">
                            Retry
                        </Button>
                        <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
