export type LayoutDensity = "comfortable" | "cozy" | "compact";
export type NavBehavior = "sticky" | "fixed" | "hideOnMobile";

export interface LayoutConfig {
    maxWidth: string;
    padding: {
        base: string;
        md: string;
        lg: string;
    };
    gap: {
        base: string;
        md: string;
        lg: string;
    };
    columns: {
        base: number;
        md: number;
        lg: number;
    };
    density: LayoutDensity;
    navBehavior: NavBehavior;
}

/**
 * Default layout tokens keep current UI unchanged (full width, no extra gap).
 * Override at runtime to adapt spacing/columns per breakpoint.
 */
export const defaultLayoutConfig: LayoutConfig = {
    maxWidth: "100%",
    padding: {
        base: "0",
        md: "0",
        lg: "0",
    },
    gap: {
        base: "0",
        md: "0",
        lg: "0",
    },
    columns: {
        base: 1,
        md: 1,
        lg: 1,
    },
    density: "comfortable",
    navBehavior: "sticky",
};

export function mergeLayoutConfig(
    base: LayoutConfig = defaultLayoutConfig,
    override?: Partial<LayoutConfig>
): LayoutConfig {
    if (!override) return base;
    return {
        ...base,
        ...override,
        padding: {
            ...base.padding,
            ...override.padding,
        },
        gap: {
            ...base.gap,
            ...override.gap,
        },
        columns: {
            ...base.columns,
            ...override.columns,
        },
    };
}
