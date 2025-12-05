import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectEditForm } from "./form";

interface Props {
    params: { id: string };
}

export default async function EditProjectPage({ params }: Props) {
    const { id } = params;
    const supabase = await createServerClient();

    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !project) {
        notFound();
    }

    return <ProjectEditForm project={project} />;
}
