export const siteConfig = {
    name: "Project Showcase",
    title: "Project Showcase | Product Manager & Frontend Architect",
    description: "Portfolio of a Product Manager and Frontend Architect bridging the gap between design, engineering, and business strategy.",
    url: "https://johndoe.com",
    ogImage: "https://johndoe.com/og.jpg",
    links: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/varmons/",
        linkedin: "https://linkedin.com/in/johndoe",
        resume: "/resume.pdf",
    },
    nav: [
        { name: "Home", href: "/" },
        { name: "Projects", href: "/projects" },
        { name: "Blog", href: "/blog" },
        { name: "Experience", href: "/experience" },
        { name: "About", href: "/about" },
    ],
};

export type SiteConfig = typeof siteConfig;
