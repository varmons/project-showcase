import { createClient } from "@/lib/supabase/client";
import type { ContactMessageInput } from "@/types";

/**
 * Creates a new contact message.
 * Used on the client side from the contact form.
 */
export async function createContactMessage(
    input: ContactMessageInput
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase.from("contact_messages").insert({
        name: input.name,
        email: input.email,
        subject: input.subject || null,
        message: input.message,
    });

    if (error) {
        console.error("Contact form error:", error);
        return { success: false, error: "Failed to submit message. Please try again." };
    }

    return { success: true };
}
