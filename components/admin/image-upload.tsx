"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    bucket: string;
    path: string;
    currentUrl?: string;
    onUpload: (url: string) => void;
}

export function ImageUpload({
    bucket,
    path,
    currentUrl,
    onUpload,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentUrl || "");
    const [error, setError] = useState("");

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setUploading(true);
        setError("");

        const supabase = createClient();

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            setError(uploadError.message);
            setUploading(false);
            return;
        }

        // Get public URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        setPreview(data.publicUrl);
        onUpload(data.publicUrl);
        setUploading(false);
    }

    function handleRemove() {
        setPreview("");
        onUpload("");
    }

    return (
        <div className="space-y-4">
            {preview ? (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-lg border border-border"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    {uploading ? (
                        <div className="text-sm text-muted-foreground">Uploading...</div>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                                Click to upload
                            </span>
                        </>
                    )}
                </label>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
