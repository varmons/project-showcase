import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { safeParseBody, type ApiResponse } from "@/lib/validation";

const updateSchema = z.object({
    key: z.string().min(1),
    value: z.any(),
});

/**
 * GET /api/settings
 * Fetch all site settings
 */
export async function GET() {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from("settings")
            .select("category, data");

        if (error) {
            console.error("Error fetching site settings:", error);
            return NextResponse.json<ApiResponse>(
                { ok: false, error: "Failed to fetch settings" },
                { status: 500 }
            );
        }

        // Transform array to object with default structure
        const settings: any = {
            general: {},
            contact: {},
            social: {},
            seo: {},
            about: {}
        };
        
        data?.forEach((item) => {
            settings[item.category] = item.data;
        });

        return NextResponse.json({ ok: true, data: settings });
    } catch (error) {
        console.error("Exception in GET /api/settings:", error);
        return NextResponse.json<ApiResponse>(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/settings
 * Update site settings and revalidate pages
 */
export async function PUT(request: NextRequest) {
    try {
        const parsed = safeParseBody(updateSchema, await request.json());
        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { ok: false, error: parsed.error },
                { status: 400 }
            );
        }
        const { key, value } = parsed.data;

        const supabase = await createClient();
        
        const { error } = await supabase
            .from("settings")
            .update({ data: value, updated_at: new Date().toISOString() })
            .eq("category", key);

        if (error) {
            console.error(`Error updating setting ${key}:`, error);
            return NextResponse.json<ApiResponse>(
                { ok: false, error: "Failed to update setting" },
                { status: 500 }
            );
        }

        // Revalidate all pages that use site settings
        revalidatePath("/", "layout"); // Revalidate root layout and all pages
        revalidatePath("/about");
        
        return NextResponse.json<ApiResponse>({ ok: true, data: true });
    } catch (error) {
        console.error("Exception in PUT /api/settings:", error);
        return NextResponse.json<ApiResponse>(
            { ok: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
