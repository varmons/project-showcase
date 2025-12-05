"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/api/settings";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const data = await getAllSiteSettings();
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!settings) return;

        setSaving(true);
        try {
            await Promise.all([
                updateSiteSettings("general", settings.general),
                updateSiteSettings("contact", settings.contact),
                updateSiteSettings("social", settings.social),
                updateSiteSettings("seo", settings.seo),
                updateSiteSettings("about", settings.about),
            ]);
            toast.success("Settings saved successfully! Frontend pages will be updated automatically.");
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!settings) {
        return <div>Failed to load settings</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Site Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your portfolio site configuration
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            {/* General Settings */}
            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">General Information</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        value={settings.general?.name || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                general: { ...settings.general, name: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={settings.general?.title || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                general: { ...settings.general, title: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                        type="text"
                        value={settings.general?.tagline || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                general: { ...settings.general, tagline: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Building Digital Products That Matter."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                        value={settings.general?.bio || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                general: { ...settings.general, bio: e.target.value },
                            })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Status Message</label>
                    <input
                        type="text"
                        value={settings.general?.status || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                general: { ...settings.general, status: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="System Status: Available"
                    />
                </div>
            </div>

            {/* Contact Settings */}
            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={settings.contact?.email || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                contact: { ...settings.contact, email: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        value={settings.contact?.phone || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                contact: { ...settings.contact, phone: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                        type="text"
                        value={settings.contact?.location || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                contact: { ...settings.contact, location: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Social Links</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                        type="url"
                        value={settings.social?.twitter || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                social: { ...settings.social, twitter: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input
                        type="url"
                        value={settings.social?.github || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                social: { ...settings.social, github: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                        type="url"
                        value={settings.social?.linkedin || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                social: { ...settings.social, linkedin: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Resume URL</label>
                    <input
                        type="text"
                        value={settings.social?.resume || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                social: { ...settings.social, resume: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* SEO Settings */}
            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">SEO & Metadata</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Site Description</label>
                    <textarea
                        value={settings.seo?.description || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                seo: { ...settings.seo, description: e.target.value },
                            })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Site URL</label>
                    <input
                        type="url"
                        value={settings.seo?.url || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                seo: { ...settings.seo, url: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">OG Image URL</label>
                    <input
                        type="url"
                        value={settings.seo?.ogImage || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                seo: { ...settings.seo, ogImage: e.target.value },
                            })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* About Page Content */}
            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">About Page Content</h2>
                <p className="text-sm text-muted-foreground">
                    This content will be displayed on the About page. You can use HTML tags for formatting.
                </p>
                
                <div>
                    <label className="block text-sm font-medium mb-2">About Me Text (HTML supported)</label>
                    <textarea
                        value={settings.about?.content || ""}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                about: { ...settings.about, content: e.target.value },
                            })
                        }
                        rows={10}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                        placeholder='<p class="text-lg">Your about text here...</p>'
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        Example: &lt;p&gt;Your text&lt;/p&gt; &lt;p&gt;&lt;strong&gt;Bold text&lt;/strong&gt;&lt;/p&gt;
                    </p>
                </div>
            </div>

            {/* Save Button at Bottom */}
            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
