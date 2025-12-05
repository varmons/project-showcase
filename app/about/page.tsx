import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/features/about/contact-form";
import { SocialLinks } from "@/components/features/about/social-links";

export const revalidate = 900;

export default async function AboutPage() {
    const supabase = await createClient();

    // Fetch about content
    const aboutResult = await supabase
        .from("settings")
        .select("data")
        .eq("category", "about")
        .single();

    // Fetch social links
    const socialResult = await supabase
        .from("settings")
        .select("data")
        .eq("category", "social")
        .single();

    // Fetch contact info
    const contactResult = await supabase
        .from("settings")
        .select("data")
        .eq("category", "contact")
        .single();

    const aboutData = aboutResult.data;
    const socialData = socialResult.data;
    const contactData = contactResult.data;

    const aboutContent = aboutData?.data?.content || `
        <p class="text-lg leading-relaxed">
            I'm a Product Manager and Frontend Architect with a passion for building
            software that solves real problems. With a background in both design and engineering,
            I thrive in the intersection of these disciplines.
        </p>
        <p>
            Over the past 5 years, I've worked with startups and enterprise companies to
            launch products from 0 to 1, and scale existing platforms to millions of users.
        </p>
        <p>
            My philosophy is simple: <strong>Shipping is the heartbeat of a product team.</strong>
            I believe in rapid iteration, user-centric design, and clean, maintainable code.
        </p>
    `;

    const socialLinks = {
        github: socialData?.data?.github || "https://github.com",
        linkedin: socialData?.data?.linkedin || "https://linkedin.com",
        twitter: socialData?.data?.twitter || "https://twitter.com",
        email: contactData?.data?.email || "hello@example.com",
    };

    return (
        <div className="container py-12 md:py-24 max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2">
                {/* About Section */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
                    <div className="prose dark:prose-invert max-w-none
                        prose-p:text-foreground/80 prose-p:leading-relaxed
                        prose-strong:text-foreground prose-strong:font-bold
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                        <div
                            className="space-y-4"
                            dangerouslySetInnerHTML={{ __html: aboutContent }}
                        />
                    </div>

                    <SocialLinks links={socialLinks} />
                </div>

                {/* Contact Form */}
                <ContactForm />
            </div>
        </div>
    );
}
