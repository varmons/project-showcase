"use client";

import { useState } from "react";
import { useContactForm } from "@/lib/hooks";
import { Button } from "@/components/ui/button";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [success, setSuccess] = useState(false);

    const { mutate, isPending, error } = useContactForm();

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) return;
        if (formData.message.length < 10) return;

        mutate(formData, {
            onSuccess: () => {
                setSuccess(true);
                setFormData({ name: "", email: "", subject: "", message: "" });
            },
        });
    }

    if (success) {
        return (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                    Message Sent!
                </h3>
                <p className="text-green-600/80 dark:text-green-400/80 mt-2">
                    Thank you for reaching out. I'll get back to you soon.
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSuccess(false)}
                >
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                    Failed to send message. Please try again.
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                </label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    minLength={10}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Minimum 10 characters
                </p>
            </div>

            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
