import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostEditForm } from "./form";

interface Props {
    params: { id: string };
}

export default async function EditPostPage({ params }: Props) {
    const { id } = params;
    const supabase = await createServerClient();

    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !post) {
        notFound();
    }

    return <PostEditForm post={post} />;
}
