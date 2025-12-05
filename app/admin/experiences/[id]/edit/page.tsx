import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExperienceEditForm } from "./form";

interface Props {
    params: { id: string };
}

export default async function EditExperiencePage({ params }: Props) {
    const { id } = params;
    const supabase = await createServerClient();

    const { data: experience, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !experience) {
        notFound();
    }

    return <ExperienceEditForm experience={experience} />;
}
