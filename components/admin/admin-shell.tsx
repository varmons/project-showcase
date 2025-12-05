"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { AdaptiveLayout } from "@/components/layout/adaptive-layout";
import { AdminSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Toaster } from "sonner";

const adminLayoutConfig = {
    maxWidth: "100%",
    padding: {
        base: "0.75rem",
        md: "1rem",
        lg: "1.25rem",
    },
    gap: {
        base: "0.75rem",
        md: "1rem",
        lg: "1.25rem",
    },
    columns: {
        base: 1,
        md: 1,
        lg: 1,
    },
} as const;

interface AdminLayoutShellProps {
    user: User;
    children: React.ReactNode;
}

export function AdminLayoutShell({ user, children }: AdminLayoutShellProps) {
    return (
        <div className="flex min-h-screen bg-background relative pb-16 lg:pb-0">
            <div className="scanlines" />

            {/* Desktop Sidebar */}
            <AdminSidebar user={user} />

            {/* Mobile Bottom Navigation */}
            <MobileNav user={user} />

            <AdaptiveLayout
                as="main"
                className="flex-1 w-full lg:ml-64 py-4 lg:py-6"
                config={adminLayoutConfig}
            >
                <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col gap-4 md:gap-6">
                        {children}
                    </div>
                </div>
            </AdaptiveLayout>

            <Toaster position="top-right" richColors />
        </div>
    );
}
