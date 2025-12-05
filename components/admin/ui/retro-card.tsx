import * as React from "react"
import { cn } from "@/lib/utils"

const RetroCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-none border-2 border-border bg-card text-card-foreground shadow-retro",
            className
        )}
        {...props}
    />
))
RetroCard.displayName = "RetroCard"

const RetroCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 border-b-2 border-border p-4 sm:p-6 bg-muted/30", className)}
        {...props}
    />
))
RetroCardHeader.displayName = "RetroCardHeader"

const RetroCardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-lg font-bold uppercase tracking-wider leading-none",
            className
        )}
        {...props}
    />
))
RetroCardTitle.displayName = "RetroCardTitle"

const RetroCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground font-mono", className)}
        {...props}
    />
))
RetroCardDescription.displayName = "RetroCardDescription"

const RetroCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 sm:p-6", className)} {...props} />
))
RetroCardContent.displayName = "RetroCardContent"

const RetroCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-4 sm:p-6 pt-0", className)}
        {...props}
    />
))
RetroCardFooter.displayName = "RetroCardFooter"

export { RetroCard, RetroCardHeader, RetroCardFooter, RetroCardTitle, RetroCardDescription, RetroCardContent }
