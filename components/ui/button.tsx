import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-none border-2 text-sm font-bold uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground border-primary shadow-retro hover:bg-primary/90 hover:shadow-retro-hover",
                destructive:
                    "bg-destructive text-destructive-foreground border-destructive shadow-retro hover:bg-destructive/90",
                outline:
                    "border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground border-secondary shadow-retro hover:bg-secondary/80",
                ghost: "hover:bg-primary/20 hover:text-primary border-transparent",
                link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none",
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-10 px-4",
                lg: "h-14 px-10 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
