import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeParseBody, type ApiResponse } from "@/lib/validation";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10),
});

export async function POST(request: Request) {
    try {
        const parsed = safeParseBody(contactSchema, await request.json());
        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { ok: false, error: parsed.error },
                { status: 400 }
            );
        }
        const { name, email, subject, message } = parsed.data;

        const supabase = await createClient();

        const { error: insertError } = await supabase
            .from("contact_messages")
            .insert([
                {
                    name,
                    email,
                    subject: subject || null,
                    message,
                    is_read: false,
                    created_at: new Date().toISOString(),
                },
            ]);

        if (insertError) {
            console.error("Error inserting message:", insertError);
            return NextResponse.json(
                { ok: false, error: "Failed to save message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
