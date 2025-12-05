"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function MarkAsReadButton({ messageId }: { messageId: string }) {
    const router = useRouter();

    async function handleMarkAsRead() {
        const supabase = createClient();
        await supabase
            .from("contact_messages")
            .update({ is_read: true })
            .eq("id", messageId);

        router.refresh();
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark Read
        </Button>
    );
}
