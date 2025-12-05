import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-lg space-y-6 text-center border-2 border-border bg-card p-8 shadow-retro">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">Error // 404</p>
                <h1 className="text-4xl font-black uppercase tracking-tight">Content Not Found</h1>
                <p className="text-muted-foreground">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/projects">View Projects</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
