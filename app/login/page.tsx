"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/admin";

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Username to email mapping
    const USERNAME_MAP: Record<string, string> = {
        "VyrnSynx": "admin@vyrnsynx.com",
        "vyrnsynx": "admin@vyrnsynx.com",
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();

            // Convert username to email if needed
            const email = USERNAME_MAP[emailOrUsername] || emailOrUsername;

            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                console.error("Auth error:", authError);
                setError(authError.message);
                setLoading(false);
                return;
            }

            router.push(redirect);
            router.refresh();
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "Failed to connect to authentication service. Please check your internet connection.");
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                >
                    Username or Email
                </label>
                <input
                    id="email"
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    autoComplete="username"
                    placeholder="VyrnSynx or admin@vyrnsynx.com"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    autoComplete="current-password"
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </Button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative">
            {/* Theme Toggle - Top Right Corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Admin Login</h1>
                    <p className="text-muted-foreground mt-2">
                        Sign in to manage your portfolio
                    </p>
                </div>

                <Suspense fallback={
                    <div className="space-y-6 animate-pulse">
                        <div className="h-10 bg-muted rounded-md"></div>
                        <div className="h-10 bg-muted rounded-md"></div>
                        <div className="h-10 bg-muted rounded-md"></div>
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
