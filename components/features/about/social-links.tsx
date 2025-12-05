"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

interface SocialLinksProps {
    links: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}

export function SocialLinks({ links }: SocialLinksProps) {
    return (
        <div className="flex gap-4 pt-4">
            {links.github && (
                <Button variant="outline" size="icon" asChild>
                    <a href={links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                </Button>
            )}
            {links.linkedin && (
                <Button variant="outline" size="icon" asChild>
                    <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                </Button>
            )}
            {links.twitter && (
                <Button variant="outline" size="icon" asChild>
                    <a href={links.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                </Button>
            )}
            {links.email && (
                <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${links.email}`}>
                        <Mail className="h-5 w-5" />
                        <span className="sr-only">Email</span>
                    </a>
                </Button>
            )}
        </div>
    );
}
