import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { MarkAsReadButton } from "./mark-as-read";
import { RetroCard } from "@/components/admin/ui/retro-card";

export default async function AdminMessagesPage() {
    const supabase = await createClient();

    const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-border pb-6">
                <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary">System // Inbox</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Contact Messages</h1>
                </div>
            </div>

            <div className="space-y-4">
                {messages?.map((message) => (
                    <RetroCard
                        key={message.id}
                        className={`p-6 border-2 ${message.is_read ? "border-border" : "border-primary shadow-retro"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold font-mono uppercase">{message.name}</h3>
                                    {!message.is_read && (
                                        <Badge variant="default" className="rounded-none border border-primary bg-primary text-primary-foreground font-mono text-[10px] uppercase">New</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">{message.email}</p>
                                {message.subject && (
                                    <p className="text-sm font-medium mt-1 font-mono uppercase tracking-wide">{message.subject}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-mono">
                                    {new Date(message.created_at).toLocaleDateString()}
                                </span>
                                {!message.is_read && (
                                    <MarkAsReadButton messageId={message.id} />
                                )}
                            </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap font-mono">{message.message}</p>
                    </RetroCard>
                ))}

                {(!messages || messages.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground font-mono border-2 border-dashed border-border p-8">
                        No messages in inbox.
                    </div>
                )}
            </div>
        </div>
    );
}
