import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { getSiteSettings } from "@/lib/api/settings.server";

export async function Hero() {
    const settings = await getSiteSettings();

    const general = settings?.general || {
        name: "Project Showcase",
        tagline: "Building Digital Products That Matter.",
        bio: "A Product Manager and Frontend Architect. Bridging the gap between design, engineering, and business strategy.",
        status: "System Status: Available",
    };

    return (
        <section className="container flex flex-col items-start justify-center gap-8 py-24 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
                <div className="border-2 border-primary w-64 h-64 rounded-full border-dashed animate-spin-slow"></div>
            </div>

            <div className="inline-flex items-center border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm text-primary font-bold uppercase tracking-widest">
                <span className="flex h-3 w-3 bg-primary mr-3 animate-pulse shadow-[0_0_10px_rgba(255,176,0,0.8)]"></span>
                {general.status}
            </div>

            <div className="space-y-2">
                <h1 className="max-w-4xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl uppercase text-foreground">
                    {general.tagline.split(" ").map((word, i) => {
                        if (word.toLowerCase() === "digital") {
                            return (
                                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive animate-pulse">
                                    Digital
                                </span>
                            );
                        }
                        if (word.toLowerCase().includes("matter")) {
                            return (
                                <span key={i} className="text-primary underline decoration-4 underline-offset-8 decoration-primary/50">
                                    {word}
                                </span>
                            );
                        }
                        return word + " ";
                    })}
                </h1>
            </div>

            <div className="max-w-[42rem] border-l-4 border-primary pl-6 py-2 bg-secondary/10">
                <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-mono">
                    <span className="text-primary mr-2">{">"}</span>
                    {general.bio}
                </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                    <Link href="/projects">
                        <Terminal className="mr-2 h-5 w-5" /> Initialize Projects
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                    <Link href="/about">Contact Protocol</Link>
                </Button>
            </div>
        </section>
    );
}
