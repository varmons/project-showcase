"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteTagButton({ tagId }: { tagId: string }) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this tag?")) return;

        const supabase = createClient();
        await supabase.from("tags").delete().eq("id", tagId);

        router.refresh();
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
    );
}
