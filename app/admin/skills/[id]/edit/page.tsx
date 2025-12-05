import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SkillEditForm } from "./form";

interface Props {
    params: { id: string };
}

export default async function EditSkillPage({ params }: Props) {
    const { id } = params;
    const supabase = await createServerClient();

    const { data: skill, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !skill) {
        notFound();
    }

    return <SkillEditForm skill={skill} />;
}
