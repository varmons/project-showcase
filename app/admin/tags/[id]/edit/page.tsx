import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TagEditForm } from "./form";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditTagPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createServerClient();

    const { data: tag, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !tag) {
        notFound();
    }

    return <TagEditForm tag={tag} />;
}
