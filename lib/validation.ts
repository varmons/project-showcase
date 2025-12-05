import { ZodSchema, z } from "zod";

export type ApiResponse<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

export function safeParseBody<T>(schema: ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
    try {
        const data = schema.parse(body);
        return { success: true, data };
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { success: false, error: err.issues.map((e) => e.message).join(", ") };
        }
        return { success: false, error: "Invalid payload" };
    }
}

