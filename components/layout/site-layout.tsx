import { getSiteSettings } from "@/lib/api/settings.server";
import { ConditionalLayout } from "./conditional-layout";

/**
 * Server Component wrapper that fetches site settings
 * and passes them to the client ConditionalLayout
 */
export async function SiteLayout({ children }: { children: React.ReactNode }) {
    const settings = await getSiteSettings();
    const siteName = settings?.general?.name || "Project Showcase";

    return (
        <ConditionalLayout siteName={siteName}>
            {children}
        </ConditionalLayout>
    );
}
