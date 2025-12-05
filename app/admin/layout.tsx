import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <AdminLayoutShell user={user}>{children}</AdminLayoutShell>;
}
