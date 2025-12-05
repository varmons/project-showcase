"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { defaultLayoutConfig, mergeLayoutConfig, type LayoutConfig } from "@/config/layout";

export interface AdaptiveLayoutProps extends React.HTMLAttributes<HTMLElement> {
    /** Optional element override, defaults to div */
    as?: React.ElementType;
    /** Partial layout tokens to override defaults at call site */
    config?: Partial<LayoutConfig>;
    children: React.ReactNode;
}

export const AdaptiveLayout = React.forwardRef<HTMLElement, AdaptiveLayoutProps>(function AdaptiveLayout(
    { as: Component = "div", config, className, children, style, ...rest },
    ref
) {
    const resolved = React.useMemo(() => mergeLayoutConfig(defaultLayoutConfig, config), [config]);

    const styleVars = React.useMemo<React.CSSProperties>(() => ({
        ["--layout-max-width" as string]: resolved.maxWidth,
        ["--layout-padding" as string]: resolved.padding.base,
        ["--layout-padding-md" as string]: resolved.padding.md,
        ["--layout-padding-lg" as string]: resolved.padding.lg,
        ["--layout-gap" as string]: resolved.gap.base,
        ["--layout-gap-md" as string]: resolved.gap.md,
        ["--layout-gap-lg" as string]: resolved.gap.lg,
        ["--layout-columns" as string]: resolved.columns.base.toString(),
        ["--layout-columns-md" as string]: resolved.columns.md.toString(),
        ["--layout-columns-lg" as string]: resolved.columns.lg.toString(),
    }), [resolved]);

    return (
        <Component
            ref={ref as any}
            className={cn("adaptive-shell", className)}
            style={{ ...styleVars, ...style }}
            {...rest}
        >
            {children}
        </Component>
    );
});
