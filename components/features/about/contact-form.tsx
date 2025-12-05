"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function ContactForm() {
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState("submitting");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setFormState("success");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage("Failed to send message. Please try again.");
            setFormState("error");
        }
    };

    return (
        <div>
            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                        Have a project in mind or just want to say hi? Fill out the form below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {formState === "success" ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="rounded-full bg-green-500/20 p-3 text-green-500">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Message Sent!</h3>
                            <p className="text-muted-foreground">
                                Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                            </p>
                            <Button variant="outline" onClick={() => setFormState("idle")}>
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {errorMessage && (
                                <p className="text-sm text-destructive">{errorMessage}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={formState === "submitting"}
                            >
                                {formState === "submitting" ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
