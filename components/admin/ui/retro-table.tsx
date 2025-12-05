import * as React from "react"
import { cn } from "@/lib/utils"

const RetroTable = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto border-2 border-border">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm font-mono", className)}
            {...props}
        />
    </div>
))
RetroTable.displayName = "RetroTable"

const RetroTableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b-2 [&_tr]:border-border bg-muted/50", className)} {...props} />
))
RetroTableHeader.displayName = "RetroTableHeader"

const RetroTableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
RetroTableBody.displayName = "RetroTableBody"

const RetroTableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t-2 border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
))
RetroTableFooter.displayName = "RetroTableFooter"

const RetroTableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
))
RetroTableRow.displayName = "RetroTableRow"

const RetroTableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-bold uppercase tracking-wider text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
RetroTableHead.displayName = "RetroTableHead"

const RetroTableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
))
RetroTableCell.displayName = "RetroTableCell"

const RetroTableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
))
RetroTableCaption.displayName = "RetroTableCaption"

export {
    RetroTable,
    RetroTableHeader,
    RetroTableBody,
    RetroTableFooter,
    RetroTableHead,
    RetroTableRow,
    RetroTableCell,
    RetroTableCaption,
}
