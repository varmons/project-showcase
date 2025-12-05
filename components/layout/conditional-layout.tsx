"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AdaptiveLayout } from "./adaptive-layout";

interface ConditionalLayoutProps {
    children: React.ReactNode;
    siteName?: string;
}

/**
 * Conditional Layout Component
 * Hides navbar and footer on admin and login routes
 */
export function ConditionalLayout({ children, siteName }: ConditionalLayoutProps) {
    const pathname = usePathname();
    
    // Check if current route is admin or login
    const isAdminRoute = pathname?.startsWith("/admin");
    const isLoginRoute = pathname === "/login";
    const hideLayout = isAdminRoute || isLoginRoute;

    if (hideLayout) {
        // Render without navbar and footer for admin/login pages
        return <>{children}</>;
    }

    // Render with navbar and footer for public pages
    return (
        <div className="relative flex min-h-screen flex-col">
            <div className="scanlines" />
            <Navbar siteName={siteName} />
            <AdaptiveLayout as="main" className="flex-1 w-full">
                {children}
            </AdaptiveLayout>
            <Footer />
        </div>
    );
}
