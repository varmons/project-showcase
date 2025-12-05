import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormAlertProps {
    message: string;
    className?: string;
}

export function FormAlert({ message, className }: FormAlertProps) {
    if (!message) return null;
    return (
        <div className={cn("p-4 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm flex items-start gap-3", className)}>
            <AlertTriangle className="h-4 w-4 mt-[2px]" />
            <span>{message}</span>
        </div>
    );
}

